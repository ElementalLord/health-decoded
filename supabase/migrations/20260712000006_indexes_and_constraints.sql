create index journeys_published_at_idx on public.journeys (published_at desc)
where status = 'published';
create index lessons_published_at_idx on public.lessons (published_at desc)
where status = 'published';
create index journey_lessons_published_order_idx on public.journey_lessons (journey_id, display_order)
where status = 'published';
create index activities_published_order_idx on public.activities (lesson_id, display_order)
where status = 'published';
create index medications_published_category_idx on public.medications (category, generic_name)
where status = 'published';
create index medications_search_vector_idx on public.medications using gin (search_vector);
create index patient_stories_published_week_idx on public.patient_stories (journey_week, published_at desc)
where status = 'published';
create index caregiver_content_published_journey_lesson_idx on public.caregiver_content (journey_lesson_id)
where status = 'published';
create index user_journeys_user_last_active_idx on public.user_journeys (user_id, last_active_at desc);
create index lesson_progress_user_journey_updated_idx on public.lesson_progress (user_journey_id, updated_at desc);
create index activity_progress_lesson_progress_updated_idx on public.activity_progress (lesson_progress_id, updated_at desc);
create index confidence_check_ins_lesson_progress_created_idx on public.confidence_check_ins (lesson_progress_id, created_at desc);
create index reflection_entries_lesson_progress_updated_idx on public.reflection_entries (lesson_progress_id, updated_at desc);
