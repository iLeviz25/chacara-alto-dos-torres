begin;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-media',
  'site-media',
  true,
  104857600,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm'
  ]::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types,
    updated_at = now();

create table public.media_categories (
  site_slug text not null,
  id text not null,
  label text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null,
  primary key (site_slug, id),
  constraint media_categories_allowed_site check (
    site_slug in ('chacara-alto-dos-torres', 'espaco-fernandes')
  ),
  constraint media_categories_safe_id check (id ~ '^[a-z0-9][a-z0-9-]{0,63}$'),
  constraint media_categories_label_length check (char_length(label) between 1 and 80)
);

create table public.media_assets (
  id text primary key,
  site_slug text not null,
  media_type text not null,
  bucket_id text not null default 'site-media',
  storage_path text not null unique,
  public_url text not null,
  local_fallback_path text,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  title text not null default '',
  caption text not null default '',
  alt_text text not null default '',
  category_id text,
  sort_order integer not null default 0,
  is_active boolean not null default false,
  is_featured boolean not null default false,
  specific_use text[] not null default '{}'::text[],
  poster_asset_id text references public.media_assets(id) on delete set null,
  is_primary boolean not null default false,
  duration_label text,
  format text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  created_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  constraint media_assets_allowed_site check (
    site_slug in ('chacara-alto-dos-torres', 'espaco-fernandes')
  ),
  constraint media_assets_allowed_type check (media_type in ('image', 'video')),
  constraint media_assets_allowed_bucket check (bucket_id = 'site-media'),
  constraint media_assets_safe_path check (
    storage_path ~ '^(chacara-alto-dos-torres|espaco-fernandes)/(images|videos)/[a-zA-Z0-9._-]+$'
  ),
  constraint media_assets_nonnegative_size check (size_bytes >= 0),
  constraint media_assets_title_length check (char_length(title) <= 180),
  constraint media_assets_caption_length check (char_length(caption) <= 1200),
  constraint media_assets_alt_length check (char_length(alt_text) <= 500),
  constraint media_assets_allowed_format check (format is null or format in ('vertical', 'horizontal')),
  foreign key (site_slug, category_id)
    references public.media_categories(site_slug, id)
    on update cascade
    on delete restrict
);

create unique index media_assets_one_primary_video_per_site_idx
  on public.media_assets (site_slug)
  where is_primary = true and media_type = 'video' and deleted_at is null;

create index media_assets_site_type_order_idx
  on public.media_assets (site_slug, media_type, sort_order)
  where deleted_at is null;

create index media_assets_category_idx
  on public.media_assets (site_slug, category_id)
  where category_id is not null and deleted_at is null;

create index media_assets_created_by_idx
  on public.media_assets (created_by)
  where created_by is not null;

create table public.media_publications (
  site_slug text primary key,
  published_config jsonb not null,
  published_at timestamptz not null default timezone('utc'::text, now()),
  published_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint media_publications_allowed_site check (
    site_slug in ('chacara-alto-dos-torres', 'espaco-fernandes')
  ),
  constraint media_publications_config_object check (jsonb_typeof(published_config) = 'object')
);

create table public.media_drafts (
  site_slug text primary key references public.media_publications(site_slug) on delete cascade,
  draft_config jsonb not null,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid not null references auth.users(id) on delete restrict,
  constraint media_drafts_config_object check (jsonb_typeof(draft_config) = 'object')
);

comment on table public.media_assets is
  'Arquivos de fotos, videos e posters, com metadados publicados e autoria administrativa.';
comment on table public.media_publications is
  'Configuracao publica e atomica das galerias e videos de cada site.';
comment on table public.media_drafts is
  'Organizacao privada de midia antes da publicacao.';

alter table public.media_categories enable row level security;
alter table public.media_categories force row level security;
alter table public.media_assets enable row level security;
alter table public.media_assets force row level security;
alter table public.media_publications enable row level security;
alter table public.media_publications force row level security;
alter table public.media_drafts enable row level security;
alter table public.media_drafts force row level security;

revoke all on table public.media_categories from anon, authenticated;
revoke all on table public.media_assets from anon, authenticated;
revoke all on table public.media_publications from anon, authenticated;
revoke all on table public.media_drafts from anon, authenticated;

grant select, insert, update, delete on table public.media_categories to authenticated;
grant select, insert, update, delete on table public.media_assets to authenticated;
grant select on table public.media_publications to anon, authenticated;
grant insert, update, delete on table public.media_publications to authenticated;
grant select, insert, update, delete on table public.media_drafts to authenticated;

create policy "admins_manage_media_categories"
on public.media_categories
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "admins_manage_media_assets"
on public.media_assets
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "published_media_config_is_public"
on public.media_publications
for select
to anon, authenticated
using (site_slug in ('chacara-alto-dos-torres', 'espaco-fernandes'));

create policy "admins_manage_media_publications"
on public.media_publications
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "admins_manage_media_drafts"
on public.media_drafts
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "admins_upload_site_media" on storage.objects;
create policy "admins_upload_site_media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-media'
  and (storage.foldername(name))[1] in ('chacara-alto-dos-torres', 'espaco-fernandes')
  and (storage.foldername(name))[2] in ('images', 'videos')
  and (select public.is_admin())
);

drop policy if exists "admins_read_site_media_objects" on storage.objects;
create policy "admins_read_site_media_objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'site-media'
  and (storage.foldername(name))[1] in ('chacara-alto-dos-torres', 'espaco-fernandes')
  and (select public.is_admin())
);

drop policy if exists "admins_update_site_media" on storage.objects;
create policy "admins_update_site_media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-media'
  and (storage.foldername(name))[1] in ('chacara-alto-dos-torres', 'espaco-fernandes')
  and (select public.is_admin())
)
with check (
  bucket_id = 'site-media'
  and (storage.foldername(name))[1] in ('chacara-alto-dos-torres', 'espaco-fernandes')
  and (storage.foldername(name))[2] in ('images', 'videos')
  and (select public.is_admin())
);

drop policy if exists "admins_delete_site_media" on storage.objects;
create policy "admins_delete_site_media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-media'
  and (storage.foldername(name))[1] in ('chacara-alto-dos-torres', 'espaco-fernandes')
  and (select public.is_admin())
);

create or replace function public.publish_media_library(p_site_slug text)
returns table (site_slug text, published_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_config jsonb;
  v_public_config jsonb;
  v_now timestamptz := timezone('utc'::text, now());
  v_category jsonb;
  v_item jsonb;
  v_primary_count integer;
begin
  if not (select public.is_admin()) then
    raise exception 'Acesso administrativo necessario' using errcode = '42501';
  end if;

  if p_site_slug not in ('chacara-alto-dos-torres', 'espaco-fernandes') then
    raise exception 'Site invalido';
  end if;

  select draft_config into v_config
  from public.media_drafts
  where public.media_drafts.site_slug = p_site_slug
  for update;

  if v_config is null then
    raise exception 'Nenhum rascunho de midia encontrado';
  end if;

  select count(*) into v_primary_count
  from jsonb_array_elements(coalesce(v_config -> 'items', '[]'::jsonb)) as item
  where item ->> 'type' = 'video'
    and coalesce((item ->> 'active')::boolean, false)
    and coalesce((item ->> 'isPrimary')::boolean, false);

  if v_primary_count > 1 then
    raise exception 'Apenas um video principal e permitido por site';
  end if;

  update public.media_assets
  set title = '',
      caption = '',
      alt_text = '',
      category_id = null,
      sort_order = 0,
      is_active = false,
      is_featured = false,
      specific_use = '{}'::text[],
      poster_asset_id = null,
      is_primary = false,
      duration_label = null,
      format = null,
      updated_at = v_now,
      updated_by = (select auth.uid())
  where media_assets.site_slug = p_site_slug
    and deleted_at is null;

  delete from public.media_categories
  where media_categories.site_slug = p_site_slug;

  for v_category in
    select value from jsonb_array_elements(coalesce(v_config -> 'categories', '[]'::jsonb))
  loop
    insert into public.media_categories (
      site_slug, id, label, sort_order, is_visible, updated_at, updated_by
    ) values (
      p_site_slug,
      v_category ->> 'id',
      v_category ->> 'label',
      coalesce((v_category ->> 'order')::integer, 0),
      coalesce((v_category ->> 'visible')::boolean, true),
      v_now,
      (select auth.uid())
    );
  end loop;

  for v_item in
    select value from jsonb_array_elements(coalesce(v_config -> 'items', '[]'::jsonb))
  loop
    update public.media_assets
    set title = coalesce(v_item ->> 'title', ''),
        caption = coalesce(v_item ->> 'caption', ''),
        alt_text = coalesce(v_item ->> 'alt', ''),
        category_id = nullif(v_item ->> 'categoryId', ''),
        sort_order = coalesce((v_item ->> 'order')::integer, 0),
        is_active = coalesce((v_item ->> 'active')::boolean, false),
        is_featured = coalesce((v_item ->> 'featured')::boolean, false),
        specific_use = coalesce(
          array(select jsonb_array_elements_text(coalesce(v_item -> 'specificUse', '[]'::jsonb))),
          '{}'::text[]
        ),
        poster_asset_id = nullif(v_item ->> 'posterAssetId', ''),
        is_primary = coalesce((v_item ->> 'isPrimary')::boolean, false),
        duration_label = nullif(v_item ->> 'duration', ''),
        format = nullif(v_item ->> 'format', ''),
        updated_at = v_now,
        updated_by = (select auth.uid())
    where id = v_item ->> 'assetId'
      and site_slug = p_site_slug
      and deleted_at is null;

    if not found then
      raise exception 'Arquivo de midia invalido no rascunho';
    end if;
  end loop;

  v_public_config := v_config - 'pendingDeletion';

  insert into public.media_publications (
    site_slug, published_config, published_at, published_by, updated_at
  ) values (
    p_site_slug, v_public_config, v_now, (select auth.uid()), v_now
  )
  on conflict on constraint media_publications_pkey do update
  set published_config = excluded.published_config,
      published_at = excluded.published_at,
      published_by = excluded.published_by,
      updated_at = excluded.updated_at;

  delete from public.media_drafts
  where public.media_drafts.site_slug = p_site_slug;

  return query select p_site_slug, v_now;
end;
$$;

revoke all on function public.publish_media_library(text) from public, anon;
grant execute on function public.publish_media_library(text) to authenticated;

commit;
