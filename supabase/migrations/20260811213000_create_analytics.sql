begin;

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create table if not exists private.analytics_config (
  singleton boolean primary key default true check (singleton),
  ingest_secret text not null default encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz not null default now()
);

insert into private.analytics_config (singleton)
values (true)
on conflict (singleton) do nothing;

revoke all on table private.analytics_config from public, anon, authenticated;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique,
  session_id uuid,
  site text not null check (site in ('chacara-alto-dos-torres', 'espaco-fernandes', 'hub')),
  event_name text not null check (event_name in ('page_view', 'whatsapp_click', 'instagram_click', 'video_play', 'gallery_open')),
  page text not null check (char_length(page) between 1 and 180),
  origin text check (origin is null or char_length(origin) <= 64),
  referrer text check (referrer is null or char_length(referrer) <= 240),
  utm_source text check (utm_source is null or char_length(utm_source) <= 240),
  utm_medium text check (utm_medium is null or char_length(utm_medium) <= 240),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 240),
  device text not null check (device in ('mobile', 'tablet', 'desktop')),
  created_at timestamptz not null default now()
);

comment on table public.analytics_events is
  'Eventos anônimos de uso dos sites públicos, sem armazenamento de IP bruto.';

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);
create index if not exists analytics_events_site_event_created_idx
  on public.analytics_events (site, event_name, created_at desc);
create index if not exists analytics_events_origin_created_idx
  on public.analytics_events (origin, created_at desc)
  where origin is not null;
create index if not exists analytics_events_utm_created_idx
  on public.analytics_events (utm_source, utm_medium, utm_campaign, created_at desc)
  where utm_source is not null or utm_medium is not null or utm_campaign is not null;

alter table public.analytics_events enable row level security;
alter table public.analytics_events force row level security;

revoke all on table public.analytics_events from anon, authenticated;
grant select on table public.analytics_events to authenticated;

drop policy if exists "analytics_events_admin_select" on public.analytics_events;
create policy "analytics_events_admin_select"
on public.analytics_events
for select
to authenticated
using ((select public.is_admin()));

create or replace function public.record_analytics_event(
  p_event_id uuid,
  p_session_id uuid,
  p_site text,
  p_event_name text,
  p_page text,
  p_origin text default null,
  p_referrer text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_device text default 'desktop'
)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  request_secret text;
  configured_secret text;
begin
  request_secret := (current_setting('request.headers', true)::jsonb ->> 'x-analytics-ingest-secret');
  select ingest_secret into configured_secret
  from private.analytics_config
  where singleton = true;

  if request_secret is null
    or configured_secret is null
    or request_secret <> configured_secret then
    raise exception 'Analytics ingestion not authorized' using errcode = '42501';
  end if;

  insert into public.analytics_events (
    event_id,
    session_id,
    site,
    event_name,
    page,
    origin,
    referrer,
    utm_source,
    utm_medium,
    utm_campaign,
    device
  ) values (
    p_event_id,
    p_session_id,
    p_site,
    p_event_name,
    p_page,
    p_origin,
    p_referrer,
    p_utm_source,
    p_utm_medium,
    p_utm_campaign,
    p_device
  )
  on conflict (event_id) do nothing;
end;
$$;

revoke all on function public.record_analytics_event(
  uuid, uuid, text, text, text, text, text, text, text, text, text
) from public, authenticated;
grant execute on function public.record_analytics_event(
  uuid, uuid, text, text, text, text, text, text, text, text, text
) to anon;

create or replace function public.get_analytics_summary(p_since timestamptz default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso administrativo necessário' using errcode = '42501';
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
        where p_since is null or created_at >= p_since
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
          coalesce(nullif(utm_medium, ''), '—') as utm_medium,
          coalesce(nullif(utm_campaign, ''), '—') as utm_campaign,
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
