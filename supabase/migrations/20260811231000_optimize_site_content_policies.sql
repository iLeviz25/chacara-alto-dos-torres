begin;

drop policy if exists "admins_manage_published_site_content"
on public.site_content;

revoke insert, delete on table public.site_content from authenticated;

create policy "admins_update_published_site_content"
on public.site_content
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create index if not exists site_content_published_by_idx
  on public.site_content (published_by)
  where published_by is not null;

create index if not exists site_content_updated_by_idx
  on public.site_content (updated_by)
  where updated_by is not null;

create index if not exists site_content_drafts_updated_by_idx
  on public.site_content_drafts (updated_by);

commit;
