do $repair_learning_streak$
declare
  v_definition pg_catalog.text;
begin
  select pg_catalog.pg_get_functiondef(
    'public.record_learning_activity(pg_catalog.text)'::pg_catalog.regprocedure
  ) into v_definition;

  execute pg_catalog.replace(v_definition, 'pg_catalog.greatest', 'greatest');
end;
$repair_learning_streak$;
