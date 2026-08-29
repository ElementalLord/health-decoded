-- The daily confidence check-in feature has been retired. Remove its write API
-- before dropping the stored responses so no application path can recreate them.
drop function if exists public.upsert_confidence_check_in(pg_catalog.uuid, pg_catalog.text);
drop table if exists public.confidence_check_ins;
