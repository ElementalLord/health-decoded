-- Give every published lesson one clear instructional job. Earlier migrations are
-- intentionally left immutable; this migration updates the learner-facing metadata.

update public.lessons
set
  primary_topic = 'Diagnosis orientation, emotional containment, first follow-up, and urgent warning signs',
  learning_objective = 'Understand the main meaning of a Type 2 diabetes diagnosis, organize the first follow-up, and recognize which serious symptoms should not wait.',
  content_blocks = '[{"type":"summary","title":"First-day essentials","points":["Too much glucose is staying in the blood.","The diagnosis is not proof that you failed.","Keep the care-team contact, appointment details, and one question together for follow-up.","Serious warning signs need urgent help."]}]'::pg_catalog.jsonb,
  key_takeaway = 'A diagnosis needs orientation, not a complete life plan: know what it means, where the first follow-up lives, and which serious symptoms should not wait.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000001';

update public.lessons
set
  subtitle = 'Read the test name, condition, unit, time window, and clinical purpose',
  primary_topic = 'Laboratory literacy, A1C biology, diagnostic tests, thresholds, and accuracy limits',
  learning_objective = 'Identify the label and time window for common diagnostic tests, distinguish a diagnostic threshold from a personal treatment goal, and explain why clinicians may compare or confirm results.',
  estimated_minutes = 12,
  content_blocks = '[{"type":"summary","title":"Your lab-reading key","points":["A glucose result needs its test name, sample condition, unit, date, and source.","A1C estimates average glucose exposure over roughly two to three months but cannot replay individual days.","Diagnostic thresholds and personal treatment goals do different jobs.","Different testing windows can be compared or confirmed with clinical context."]}]'::pg_catalog.jsonb,
  key_takeaway = 'Read the label and time window before interpreting the value; thresholds identify a condition, while personal goals are chosen separately.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000003';

update public.lessons
set
  subtitle = 'How working muscles use glucose and why many kinds of activity count',
  primary_topic = 'Movement physiology, activity types, wider body benefits, and general safety',
  learning_objective = 'Explain how working muscles use glucose, distinguish broad activity types, identify benefits beyond weight change, and recognize a safe starting principle.',
  estimated_minutes = 12,
  content_blocks = '[{"type":"summary","title":"Movement mechanisms","points":["Working muscles can take up glucose and use it for energy.","Regular physical activity can improve insulin sensitivity.","Physical activity includes ordinary movement and play, not only formal workouts.","Movement can support the heart, strength, mood, sleep, and everyday function."]}]'::pg_catalog.jsonb,
  key_takeaway = 'Movement is a body process, not a performance test: muscle work uses fuel, many activity types count, and benefits extend beyond one number.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000005';

update public.lessons
set
  subtitle = 'Place movement in a real setting that fits the body and the day',
  primary_topic = 'Movement placement, sitting breaks, small bouts, accessibility, setting, and duration choices',
  learning_objective = 'Use body-fit and life-fit checks, identify an approachable opening for movement, and write one clear movement instruction with a setting, finish point, and starting duration.',
  estimated_minutes = 14,
  content_blocks = '[{"type":"summary","title":"Your movement design","points":["Body fit considers comfort, ability, safety, recovery, and personal guidance.","Life fit considers setting, access, time, company, and preference.","Sitting breaks and small bouts create usable movement openings.","A clear movement instruction names where, what, when to finish, and for how long."]}]'::pg_catalog.jsonb,
  key_takeaway = 'A movement option becomes usable when it fits both the body and the setting and is clear enough to begin and finish.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000006';

update public.lessons
set
  primary_topic = 'Person-centered medication choice, body pathways, insulin, side effects, low-glucose risk, and prescription literacy',
  learning_objective = 'Explain why medication may be part of care, describe several high-level pathways, recognize insulin as treatment, and identify which prescription fact to verify with a reliable source.',
  content_blocks = '[{"type":"summary","title":"Medicine literacy card","points":["Medication is a tool, not a judgment.","Different medicines work through different pathways, and the plan should be fitted to the person.","Know the exact medicine name, purpose, label instructions, and which safety questions need a pharmacist or prescribing team."]}]'::pg_catalog.jsonb,
  key_takeaway = 'Medication is one fitted treatment tool; verify the exact name, purpose, instructions, and safety information for the prescription you have.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000007';

update public.lessons
set
  subtitle = 'Use home monitoring to answer a defined care question',
  primary_topic = 'Monitoring purpose, finger-stick and CGM use, context, patterns, and care-team questions',
  learning_objective = 'Match a monitoring tool to a defined care question, add context to home data, identify a repeated pattern, and prepare one useful question for the care team.',
  content_blocks = '[{"type":"summary","title":"Monitoring field notes","points":["Begin with the question the information should help answer.","Finger-stick and CGM data have different operational uses; not every person needs every tool.","Repeated context can turn home data into a useful care-team question.","Numbers measure glucose, not effort, courage, or worth."]}]'::pg_catalog.jsonb,
  key_takeaway = 'Monitoring is useful when it has a defined question: collect the right view, add context, and carry the pattern into a care conversation.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000008';

update public.lessons
set
  primary_topic = 'Decision fatigue, habit stacking, environment design, visible reminders, and completion cues',
  learning_objective = 'Explain how routines reduce decision fatigue, build a habit stack, arrange an environment cue, and add a neutral finish cue that closes the routine loop.',
  content_blocks = '[{"type":"summary","title":"Routine recipe","points":["A routine reduces the number of decisions the day has to demand.","A small habit can be attached to an existing anchor.","Visible environment cues make the intended choice easier to notice.","A neutral finish cue marks completion without adding pressure or a grade."]}]'::pg_catalog.jsonb,
  key_takeaway = 'A small routine has an anchor, an approachable action, an environment that supports it, and a clear ending.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000010';

update public.lessons
set
  subtitle = 'Solve changed meals, sick days, missed doses, and care-team handoffs',
  primary_topic = 'Flexible problem solving, sick-day planning, care-team handoffs, missed-dose safety, and Plan B strategies',
  learning_objective = 'Use a pause-understand-choose-adjust sequence, build one practical Plan B, explain the anchors of a personal sick-day plan, and prepare a concise care-team handoff when instructions are unclear.',
  content_blocks = '[{"type":"summary","title":"Problem-solving sequence","points":["Pause, understand what changed, choose one available response, and adjust again if needed.","Illness changes the conditions; use the personal written sick-day plan.","A useful care-team handoff names what changed, what was already followed, and what needs an answer.","Missed-dose rules are medicine-specific, so check the exact instructions rather than guessing or doubling."]}]'::pg_catalog.jsonb,
  key_takeaway = 'Adaptability is a sequence: identify the changed condition, use the written plan, carry specific details into the call, and adjust with qualified guidance.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000012';

update public.lessons
set
  subtitle = 'Choose support, protect privacy, respond to stigma, and set boundaries',
  primary_topic = 'Social stigma, consent, disclosure, boundaries, emotional wellbeing, and chosen support',
  learning_objective = 'Identify the social assumptions inside stigma, distinguish support from surveillance, choose how much to disclose, set one respectful boundary, and make one concrete request for help.',
  content_blocks = '[{"type":"summary","title":"Relationship agreements","points":["Disclosure belongs to the person living with diabetes.","Concern still needs consent; helpful support asks and respects a no.","Intent does not erase impact, and a brief boundary can name the limit.","Chosen support can reduce burden while leaving decisions with the person."]}]'::pg_catalog.jsonb,
  key_takeaway = 'Support can lighten a chosen part of care without taking over; privacy, consent, impact, and boundaries remain with the person.',
  updated_at = pg_catalog.now()
where id = '20000000-0000-0000-0000-000000000013';

update public.lessons as lesson
set
  content_blocks = pg_catalog.jsonb_set(
    lesson.content_blocks,
    '{0,title}',
    pg_catalog.to_jsonb(recap.title::text),
    false
  ),
  updated_at = pg_catalog.now()
from (
  values
    ('20000000-0000-0000-0000-000000000002'::uuid, 'Body-story recap'),
    ('20000000-0000-0000-0000-000000000004'::uuid, 'Four permissions'),
    ('20000000-0000-0000-0000-000000000009'::uuid, 'Action cues'),
    ('20000000-0000-0000-0000-000000000011'::uuid, 'Prevention calendar')
) as recap(id, title)
where lesson.id = recap.id;
