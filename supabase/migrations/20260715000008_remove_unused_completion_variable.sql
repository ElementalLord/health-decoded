-- Keep the public completion wrapper warning-free by selecting only the values
-- it returns from the private operation.
do $$
declare
  v_definition pg_catalog.text;
begin
  v_definition := pg_catalog.pg_get_functiondef(
    'public.complete_current_lesson(uuid)'::pg_catalog.regprocedure
  );
  v_definition := pg_catalog.replace(
    v_definition,
    '  v_ignored_total_xp pg_catalog.int4;' || pg_catalog.chr(10),
    ''
  );
  v_definition := pg_catalog.replace(
    v_definition,
    '    completion.total_xp_awarded,' || pg_catalog.chr(10),
    ''
  );
  v_definition := pg_catalog.replace(
    v_definition,
    '    v_ignored_total_xp,' || pg_catalog.chr(10),
    ''
  );
  execute v_definition;
end;
$$;
