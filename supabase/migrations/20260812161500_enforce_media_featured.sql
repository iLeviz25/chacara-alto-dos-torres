begin;

create unique index if not exists media_assets_one_featured_image_per_site_idx
  on public.media_assets (site_slug)
  where is_featured = true
    and is_active = true
    and media_type = 'image'
    and deleted_at is null;

commit;
