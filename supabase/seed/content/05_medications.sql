insert into public.medications (
  id, slug, generic_name, brand_names, category, content_blocks, search_text,
  status, reviewed_by, reviewed_at, published_at
) values (
  '50000000-0000-0000-0000-000000000001',
  'development-medication',
  'Development medication',
  '{}',
  'Development',
  '[{"type":"text","heading":"Development seed","body":"Not medical guidance or production content."}]'::jsonb,
  'development seed only',
  'published',
  'Development seed',
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z'
)
on conflict (id) do update set
  generic_name = excluded.generic_name,
  brand_names = excluded.brand_names,
  category = excluded.category,
  content_blocks = excluded.content_blocks,
  search_text = excluded.search_text,
  status = excluded.status,
  reviewed_by = excluded.reviewed_by,
  reviewed_at = excluded.reviewed_at,
  published_at = excluded.published_at;
