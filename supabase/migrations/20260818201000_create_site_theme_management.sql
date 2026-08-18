create table if not exists public.site_theme_publications (
  site_slug text primary key check (site_slug in ('chacara-alto-dos-torres', 'espaco-fernandes')),
  display_name text not null check (char_length(display_name) between 1 and 120),
  published_theme jsonb not null check (jsonb_typeof(published_theme) = 'object'),
  published_at timestamptz not null default timezone('utc'::text, now()),
  published_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.site_theme_drafts (
  site_slug text primary key references public.site_theme_publications(site_slug) on delete cascade,
  draft_theme jsonb not null check (jsonb_typeof(draft_theme) = 'object'),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid not null references auth.users(id) on delete restrict
);

create index if not exists site_theme_publications_published_by_idx
  on public.site_theme_publications (published_by)
  where published_by is not null;

create index if not exists site_theme_drafts_updated_by_idx
  on public.site_theme_drafts (updated_by);

comment on table public.site_theme_publications is
  'Temas publicados e independentes dos dois sites publicos.';
comment on table public.site_theme_drafts is
  'Rascunhos privados de aparencia, acessiveis somente a administradores ativos.';

alter table public.site_theme_publications enable row level security;
alter table public.site_theme_publications force row level security;
alter table public.site_theme_drafts enable row level security;
alter table public.site_theme_drafts force row level security;

revoke all on table public.site_theme_publications from anon, authenticated;
revoke all on table public.site_theme_drafts from anon, authenticated;

grant select on table public.site_theme_publications to anon, authenticated;
grant insert, update, delete on table public.site_theme_publications to authenticated;
grant select, insert, update, delete on table public.site_theme_drafts to authenticated;

create policy "published_site_themes_are_public"
on public.site_theme_publications
for select
to anon, authenticated
using (site_slug in ('chacara-alto-dos-torres', 'espaco-fernandes'));

create policy "admins_insert_site_themes"
on public.site_theme_publications
for insert
to authenticated
with check ((select public.is_admin()));

create policy "admins_update_site_themes"
on public.site_theme_publications
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "admins_delete_site_themes"
on public.site_theme_publications
for delete
to authenticated
using ((select public.is_admin()));

create policy "admins_manage_site_theme_drafts"
on public.site_theme_drafts
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

insert into public.site_theme_publications (site_slug, display_name, published_theme)
values
  (
    'chacara-alto-dos-torres',
    'Chácara Alto dos Torres',
    '{
      "colors": {
        "primary": "#0d293c",
        "accent": "#f47f20",
        "background": "#f7f2e8",
        "surface": "#ffffff",
        "text": "#1d2930"
      },
      "fonts": { "heading": "editorial", "body": "system" },
      "radius": { "cards": "rounded", "buttons": "pill" },
      "shadows": "soft",
      "animations": true
    }'::jsonb
  ),
  (
    'espaco-fernandes',
    'Espaço Fernandes',
    '{
      "colors": {
        "primary": "#242423",
        "accent": "#f3904f",
        "background": "#f5f1ea",
        "surface": "#ffffff",
        "text": "#292928"
      },
      "fonts": { "heading": "editorial", "body": "system" },
      "radius": { "cards": "large", "buttons": "pill" },
      "shadows": "medium",
      "animations": true
    }'::jsonb
  )
on conflict (site_slug) do nothing;

create or replace function public.publish_site_theme(p_site_slug text)
returns table(site_slug text, published_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_theme jsonb;
  v_now timestamptz := timezone('utc'::text, now());
begin
  if not (select public.is_admin()) then
    raise exception 'Acesso administrativo necessario' using errcode = '42501';
  end if;

  if p_site_slug not in ('chacara-alto-dos-torres', 'espaco-fernandes') then
    raise exception 'Site invalido';
  end if;

  select draft_theme into v_theme
  from public.site_theme_drafts
  where public.site_theme_drafts.site_slug = p_site_slug
  for update;

  if v_theme is null then
    raise exception 'Nenhum rascunho de tema encontrado';
  end if;

  update public.site_theme_publications
  set published_theme = v_theme,
      published_at = v_now,
      published_by = (select auth.uid()),
      updated_at = v_now
  where public.site_theme_publications.site_slug = p_site_slug;

  if not found then
    raise exception 'Site nao encontrado';
  end if;

  delete from public.site_theme_drafts
  where public.site_theme_drafts.site_slug = p_site_slug;

  return query select p_site_slug, v_now;
end;
$$;

revoke all on function public.publish_site_theme(text) from public, anon;
grant execute on function public.publish_site_theme(text) to authenticated;
