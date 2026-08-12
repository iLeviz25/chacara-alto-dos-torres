begin;

create index if not exists media_assets_poster_asset_id_idx
  on public.media_assets (poster_asset_id)
  where poster_asset_id is not null;

create index if not exists media_assets_updated_by_idx
  on public.media_assets (updated_by)
  where updated_by is not null;

create index if not exists media_assets_deleted_by_idx
  on public.media_assets (deleted_by)
  where deleted_by is not null;

create index if not exists media_categories_updated_by_idx
  on public.media_categories (updated_by)
  where updated_by is not null;

create index if not exists media_drafts_updated_by_idx
  on public.media_drafts (updated_by);

create index if not exists media_publications_published_by_idx
  on public.media_publications (published_by)
  where published_by is not null;

drop policy if exists "admins_manage_media_publications" on public.media_publications;
create policy "admins_insert_media_publications"
on public.media_publications
for insert
to authenticated
with check ((select public.is_admin()));

create policy "admins_update_media_publications"
on public.media_publications
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "admins_delete_media_publications"
on public.media_publications
for delete
to authenticated
using ((select public.is_admin()));

revoke execute on function public.publish_media_library(text) from public, anon;
grant execute on function public.publish_media_library(text) to authenticated;

commit;
