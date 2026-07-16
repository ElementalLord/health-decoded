delete from public.activities
where id in (
  '40000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000002'
)
  and status = 'archived';
