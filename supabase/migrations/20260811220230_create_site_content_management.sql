begin;

create table public.site_content (
  site_slug text primary key,
  display_name text not null,
  published_content jsonb not null,
  published_at timestamptz not null default timezone('utc'::text, now()),
  published_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null,
  constraint site_content_allowed_slug check (
    site_slug in ('chacara-alto-dos-torres', 'espaco-fernandes')
  ),
  constraint site_content_is_object check (jsonb_typeof(published_content) = 'object')
);

comment on table public.site_content is
  'Conteudo publicado dos sites publicos. Rascunhos ficam em tabela separada.';

create table public.site_content_drafts (
  site_slug text primary key references public.site_content(site_slug) on delete cascade,
  draft_content jsonb not null,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid not null references auth.users(id) on delete restrict,
  constraint site_content_draft_is_object check (jsonb_typeof(draft_content) = 'object')
);

comment on table public.site_content_drafts is
  'Rascunhos privados, acessiveis somente a administradores ativos.';

alter table public.site_content enable row level security;
alter table public.site_content force row level security;
alter table public.site_content_drafts enable row level security;
alter table public.site_content_drafts force row level security;

revoke all on table public.site_content from anon, authenticated;
grant select on table public.site_content to anon, authenticated;
grant insert, update, delete on table public.site_content to authenticated;

revoke all on table public.site_content_drafts from anon, authenticated;
grant select, insert, update, delete on table public.site_content_drafts to authenticated;

create policy "published_site_content_is_public"
on public.site_content
for select
to anon, authenticated
using (site_slug in ('chacara-alto-dos-torres', 'espaco-fernandes'));

create policy "admins_manage_published_site_content"
on public.site_content
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "admins_manage_site_content_drafts"
on public.site_content_drafts
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create or replace function public.publish_site_content(p_site_slug text)
returns table (site_slug text, published_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_content jsonb;
  v_published_at timestamptz := timezone('utc'::text, now());
begin
  if not (select public.is_admin()) then
    raise exception 'Acesso administrativo necessario';
  end if;

  if p_site_slug not in ('chacara-alto-dos-torres', 'espaco-fernandes') then
    raise exception 'Site invalido';
  end if;

  select draft_content
    into v_content
  from public.site_content_drafts
  where public.site_content_drafts.site_slug = p_site_slug
  for update;

  if v_content is null then
    raise exception 'Nenhum rascunho encontrado';
  end if;

  update public.site_content
  set published_content = v_content,
      published_at = v_published_at,
      published_by = (select auth.uid()),
      updated_at = v_published_at,
      updated_by = (select auth.uid())
  where public.site_content.site_slug = p_site_slug;

  if not found then
    raise exception 'Site nao encontrado';
  end if;

  delete from public.site_content_drafts
  where public.site_content_drafts.site_slug = p_site_slug;

  return query select p_site_slug, v_published_at;
end;
$$;

revoke all on function public.publish_site_content(text) from public, anon;
grant execute on function public.publish_site_content(text) to authenticated;

commit;
