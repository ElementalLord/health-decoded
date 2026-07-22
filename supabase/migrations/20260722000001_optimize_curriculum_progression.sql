-- Align learner-facing metadata with the post-build curriculum ownership review.
-- The custom lesson experiences remain the source of full instructional content.

update public.lessons
set
  estimated_minutes = 12,
  content_blocks = '[{"type":"summary","title":"Four permissions to carry forward","points":["Food provides nourishment, culture, connection, and celebration.","Carbohydrate foods affect blood glucose but do not need to disappear.","Fiber, protein, vegetables, portions, and meal context can add balance.","A flexible eating pattern tells you more than one meal."]}]'::pg_catalog.jsonb,
  key_takeaway = 'Carbohydrate can remain, balance can be added, and a flexible eating pattern can include culture, preference, and real life.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000004';

update public.lessons
set
  learning_objective = 'Explain how working muscles use glucose, distinguish the immediate and longer-term effects of activity, identify approachable aerobic and strength movement, and recognize the safety factors that make a starting point appropriate.',
  content_blocks = '[{"type":"summary","title":"Three truths to carry forward","points":["Working muscles can take up glucose and use it for energy.","Regular physical activity can improve insulin sensitivity over time.","Movement also supports the heart, strength, mood, sleep, and daily function."]}]'::pg_catalog.jsonb,
  key_takeaway = 'Movement is a body tool: working muscles use fuel, regular activity can improve insulin sensitivity, and the benefits extend beyond a single reading.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000005';

update public.lessons
set
  primary_topic = 'Movement timing, sitting breaks, small bouts, setting, duration, and flexible movement design',
  learning_objective = 'Use body fit and life fit to identify an approachable movement moment, interrupt one sitting stretch, and design a safe movement instruction card with a realistic setting and duration.',
  content_blocks = '[{"type":"summary","title":"Three truths to carry forward","points":["Body fit and life fit come before a movement plan.","Small bouts and sitting breaks can create approachable openings.","Setting, duration, comfort, and safety make a movement idea usable in real life."]}]'::pg_catalog.jsonb,
  key_takeaway = 'Find one seam in the day, choose a safe action that fits the body and setting, and make the first duration realistic.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000006';

update public.lessons
set
  primary_topic = 'A1C, finger-stick readings, continuous glucose monitoring, context, patterns, and question-led monitoring',
  learning_objective = 'Distinguish the longer A1C view from one-moment finger-stick readings and many-moment CGM data, connect monitoring to a defined care question, and prepare one contextual question for the care team.',
  content_blocks = '[{"type":"summary","title":"Three ideas worth carrying","points":["Different monitoring tools answer different kinds of questions.","One reading is a clue; repeated context can reveal a more useful pattern.","A monitoring plan is most useful when it names the question and the agreed response."]}]'::pg_catalog.jsonb,
  key_takeaway = 'Start with the care question, choose the tool that fits its time window, add context, and use the pattern in conversation.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000008';

update public.lessons
set
  primary_topic = 'Routines, decision fatigue, habit stacking, environment design, and clear finish cues',
  learning_objective = 'Explain how routines reduce daily decision fatigue, build a habit stack that attaches one small action to an existing anchor, place visible environment supports, and name a finish cue that closes the loop.',
  content_blocks = '[{"type":"summary","title":"Three ideas worth carrying","points":["A routine reduces the need to make the same decision again.","A small action can attach to an anchor that already happens.","Visible supports and a clear finish cue make the routine easier to repeat."]}]'::pg_catalog.jsonb,
  key_takeaway = 'A repeatable routine has an existing anchor, one small action, visible support, and a clear finish cue.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000010';

update public.lessons
set
  content_blocks = '[{"type":"summary","title":"Three truths worth carrying","points":["Pause, understand what changed, choose one workable response, and adjust again if needed.","Illness changes the conditions. Hydration, personal sick-day instructions, and knowing when to call make the plan safer.","Medication rules are specific. Check the exact instructions and ask a pharmacist or care team rather than guessing or doubling."]}]'::pg_catalog.jsonb,
  key_takeaway = 'When conditions change, use the same four-step solver: pause, understand, choose, and adjust.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000012';

update public.lessons
set
  reviewed_by = 'Health Decoded curriculum optimization review; ADA Standards of Care in Diabetes—2026; CDC diabetes guidance',
  reviewed_at = '2026-07-22T00:00:00Z',
  updated_at = pg_catalog.now()
where id in (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007',
  '20000000-0000-0000-0000-000000000008',
  '20000000-0000-0000-0000-000000000009',
  '20000000-0000-0000-0000-000000000010',
  '20000000-0000-0000-0000-000000000011',
  '20000000-0000-0000-0000-000000000012',
  '20000000-0000-0000-0000-000000000013'
);
