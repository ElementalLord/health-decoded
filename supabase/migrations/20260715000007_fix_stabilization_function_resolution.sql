-- Migration 00006 qualified COALESCE as though it were an ordinary pg_catalog
-- function. PostgreSQL implements COALESCE as special SQL syntax, so replace the
-- stored definitions without changing their validated behavior or privileges.
do $$
declare
  v_function pg_catalog.regprocedure;
begin
  foreach v_function in array array[
    'public.complete_onboarding(text,text,text,boolean,text)'::pg_catalog.regprocedure,
    'public.initialize_current_user_journey()'::pg_catalog.regprocedure,
    'public.complete_current_lesson(uuid)'::pg_catalog.regprocedure
  ]
  loop
    execute pg_catalog.replace(
      pg_catalog.pg_get_functiondef(v_function),
      'pg_catalog.coalesce',
      'coalesce'
    );
  end loop;
end;
$$;
