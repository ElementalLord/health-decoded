-- Align deployed lesson copy with the em-dash-free source. Earlier migrations
-- seeded a few subtitles, key takeaways, and summary blocks that contained em
-- dashes; replace them with commas so no user-facing string renders an em dash.
-- Unicode escapes (U&'\2014') are used so this file itself contains none, and
-- the spaced form is handled before the closed form to avoid stray spacing.
update public.lessons
set
  subtitle = replace(replace(subtitle, U&' \2014 ', ', '), U&'\2014', ', '),
  key_takeaway = replace(replace(key_takeaway, U&' \2014 ', ', '), U&'\2014', ', '),
  content_blocks =
    replace(replace(content_blocks::text, U&' \2014 ', ', '), U&'\2014', ', ')::pg_catalog.jsonb,
  updated_at = pg_catalog.now()
where subtitle like U&'%\2014%'
  or key_takeaway like U&'%\2014%'
  or content_blocks::text like U&'%\2014%';
