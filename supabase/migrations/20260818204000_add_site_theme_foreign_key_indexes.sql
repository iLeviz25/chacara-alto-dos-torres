create index if not exists site_theme_publications_published_by_idx
  on public.site_theme_publications (published_by)
  where published_by is not null;

create index if not exists site_theme_drafts_updated_by_idx
  on public.site_theme_drafts (updated_by);
