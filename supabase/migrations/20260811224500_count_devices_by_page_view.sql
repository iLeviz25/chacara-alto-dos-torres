begin;

create or replace function public.get_analytics_summary(p_since timestamptz default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso administrativo necessario' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'totals', coalesce((
      select jsonb_agg(to_jsonb(summary_rows))
      from (
        select site, event_name, count(*)::bigint as count
        from public.analytics_events
        where p_since is null or created_at >= p_since
        group by site, event_name
        order by site, event_name
      ) summary_rows
    ), '[]'::jsonb),
    'devices', coalesce((
      select jsonb_agg(to_jsonb(device_rows))
      from (
        select site, device, count(*)::bigint as count
        from public.analytics_events
        where event_name = 'page_view'
          and (p_since is null or created_at >= p_since)
        group by site, device
        order by count(*) desc
      ) device_rows
    ), '[]'::jsonb),
    'referrers', coalesce((
      select jsonb_agg(to_jsonb(referrer_rows))
      from (
        select site, coalesce(nullif(referrer, ''), 'Direto') as referrer, count(*)::bigint as count
        from public.analytics_events
        where event_name = 'page_view'
          and (p_since is null or created_at >= p_since)
        group by site, coalesce(nullif(referrer, ''), 'Direto')
        order by count(*) desc
        limit 30
      ) referrer_rows
    ), '[]'::jsonb),
    'campaigns', coalesce((
      select jsonb_agg(to_jsonb(campaign_rows))
      from (
        select
          site,
          coalesce(nullif(utm_source, ''), 'Sem UTM') as utm_source,
          coalesce(nullif(utm_medium, ''), '-') as utm_medium,
          coalesce(nullif(utm_campaign, ''), '-') as utm_campaign,
          count(*)::bigint as count
        from public.analytics_events
        where event_name = 'page_view'
          and (utm_source is not null or utm_medium is not null or utm_campaign is not null)
          and (p_since is null or created_at >= p_since)
        group by site, utm_source, utm_medium, utm_campaign
        order by count(*) desc
        limit 30
      ) campaign_rows
    ), '[]'::jsonb),
    'whatsappOrigins', coalesce((
      select jsonb_agg(to_jsonb(origin_rows))
      from (
        select site, coalesce(nullif(origin, ''), 'outro') as origin, count(*)::bigint as count
        from public.analytics_events
        where event_name = 'whatsapp_click'
          and (p_since is null or created_at >= p_since)
        group by site, coalesce(nullif(origin, ''), 'outro')
        order by count(*) desc
      ) origin_rows
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_analytics_summary(timestamptz) from public, anon;
grant execute on function public.get_analytics_summary(timestamptz) to authenticated;

commit;
