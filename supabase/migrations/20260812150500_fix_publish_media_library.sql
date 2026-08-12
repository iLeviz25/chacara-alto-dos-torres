begin;

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
  set title = '', caption = '', alt_text = '', category_id = null,
      sort_order = 0, is_active = false, is_featured = false,
      specific_use = '{}'::text[], poster_asset_id = null,
      is_primary = false, duration_label = null, format = null,
      updated_at = v_now, updated_by = (select auth.uid())
  where media_assets.site_slug = p_site_slug and deleted_at is null;

  delete from public.media_categories
  where media_categories.site_slug = p_site_slug;

  for v_category in
    select value from jsonb_array_elements(coalesce(v_config -> 'categories', '[]'::jsonb))
  loop
    insert into public.media_categories (
      site_slug, id, label, sort_order, is_visible, updated_at, updated_by
    ) values (
      p_site_slug, v_category ->> 'id', v_category ->> 'label',
      coalesce((v_category ->> 'order')::integer, 0),
      coalesce((v_category ->> 'visible')::boolean, true),
      v_now, (select auth.uid())
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
      and media_assets.site_slug = p_site_slug
      and deleted_at is null;
    if not found then raise exception 'Arquivo de midia invalido no rascunho'; end if;
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
