create extension if not exists pgcrypto;

create type public.app_role as enum ('user', 'admin');
create type public.profile_language as enum ('ti', 'en');
create type public.testament as enum ('old', 'new');
create type public.content_status as enum ('draft', 'scheduled', 'published');
create type public.group_privacy as enum ('private');
create type public.group_member_role as enum ('member', 'leader', 'admin');
create type public.study_status as enum ('draft', 'active', 'completed', 'archived');
create type public.prayer_visibility as enum ('group', 'leaders');
create type public.prayer_status as enum ('active', 'answered', 'archived');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  preferred_language public.profile_language not null default 'ti',
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bible_translations (
  id uuid primary key default gen_random_uuid(), code text not null unique,
  name text not null, language text not null, copyright text,
  license_information text, is_active boolean not null default false
);
create table public.bible_books (
  id uuid primary key default gen_random_uuid(), canonical_order smallint not null unique check (canonical_order > 0),
  testament public.testament not null, english_name text not null unique,
  tigrinya_name text not null, abbreviation text not null unique
);
create table public.bible_verses (
  id uuid primary key default gen_random_uuid(),
  translation_id uuid not null references public.bible_translations(id) on delete restrict,
  book_id uuid not null references public.bible_books(id) on delete restrict,
  chapter_number smallint not null check (chapter_number > 0),
  verse_number smallint not null check (verse_number > 0), text text not null,
  unique (translation_id, book_id, chapter_number, verse_number)
);
create index bible_verses_lookup_idx on public.bible_verses (translation_id, book_id, chapter_number, verse_number);

create table public.daily_devotions (
  id uuid primary key default gen_random_uuid(), publish_date date not null unique,
  title_tigrinya text not null, title_english text, content_tigrinya text not null, content_english text,
  reflection_question_tigrinya text, reflection_question_english text,
  prayer_tigrinya text, prayer_english text,
  verse_translation_id uuid references public.bible_translations(id) on delete restrict,
  verse_book_id uuid references public.bible_books(id) on delete restrict,
  verse_chapter smallint check (verse_chapter > 0), verse_start smallint check (verse_start > 0),
  verse_end smallint check (verse_end > 0), status public.content_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (verse_end is null or verse_start is not null),
  check (verse_end is null or verse_end >= verse_start)
);
create index daily_devotions_publication_idx on public.daily_devotions (status, publish_date);

create table public.saved_verses (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  translation_id uuid not null references public.bible_translations(id) on delete cascade,
  book_id uuid not null references public.bible_books(id) on delete cascade,
  chapter_number smallint not null check (chapter_number > 0), verse_number smallint not null check (verse_number > 0),
  created_at timestamptz not null default now(), unique (user_id, translation_id, book_id, chapter_number, verse_number)
);
create table public.verse_highlights (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  translation_id uuid not null references public.bible_translations(id) on delete cascade,
  book_id uuid not null references public.bible_books(id) on delete cascade,
  chapter_number smallint not null check (chapter_number > 0), verse_number smallint not null check (verse_number > 0),
  highlight_style text not null check (highlight_style in ('yellow','green','blue','pink','purple')),
  created_at timestamptz not null default now(), unique (user_id, translation_id, book_id, chapter_number, verse_number)
);
create table public.verse_notes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  translation_id uuid not null references public.bible_translations(id) on delete cascade,
  book_id uuid not null references public.bible_books(id) on delete cascade,
  chapter_number smallint not null check (chapter_number > 0), verse_number smallint not null check (verse_number > 0),
  note text not null check (char_length(note) between 1 and 10000), created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), unique (user_id, translation_id, book_id, chapter_number, verse_number)
);

create table public.groups (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 120),
  description text, owner_id uuid not null references public.profiles(id) on delete restrict,
  privacy public.group_privacy not null default 'private', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index groups_owner_idx on public.groups(owner_id);
create table public.group_members (
  id uuid primary key default gen_random_uuid(), group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.group_member_role not null default 'member', joined_at timestamptz not null default now(), unique (group_id, user_id)
);
create index group_members_user_idx on public.group_members(user_id, group_id);
create table public.group_invites (
  id uuid primary key default gen_random_uuid(), group_id uuid not null references public.groups(id) on delete cascade,
  invite_code text not null unique, created_by uuid not null references public.profiles(id) on delete cascade,
  expires_at timestamptz, max_uses integer check (max_uses is null or max_uses > 0),
  usage_count integer not null default 0 check (usage_count >= 0), created_at timestamptz not null default now(),
  check (max_uses is null or usage_count <= max_uses)
);
create index group_invites_group_idx on public.group_invites(group_id);
create table public.group_studies (
  id uuid primary key default gen_random_uuid(), group_id uuid not null references public.groups(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200), description text,
  book_id uuid references public.bible_books(id) on delete restrict,
  chapter_start smallint check (chapter_start > 0), verse_start smallint check (verse_start > 0),
  chapter_end smallint check (chapter_end > 0), verse_end smallint check (verse_end > 0),
  created_by uuid not null references public.profiles(id) on delete restrict, starts_at timestamptz,
  status public.study_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (chapter_end is null or chapter_start is not null),
  check (chapter_end is null or chapter_end >= chapter_start)
);
create index group_studies_group_idx on public.group_studies(group_id, status, starts_at);
create table public.study_questions (
  id uuid primary key default gen_random_uuid(), study_id uuid not null references public.group_studies(id) on delete cascade,
  question text not null check (char_length(question) between 1 and 2000), display_order smallint not null check (display_order > 0),
  created_at timestamptz not null default now(), unique (study_id, display_order)
);
create table public.study_responses (
  id uuid primary key default gen_random_uuid(), question_id uuid not null references public.study_questions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  response text not null check (char_length(response) between 1 and 10000),
  parent_response_id uuid references public.study_responses(id) on delete cascade,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index study_responses_question_idx on public.study_responses(question_id, created_at);
create index study_responses_user_idx on public.study_responses(user_id);

create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(), group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200), request text not null check (char_length(request) between 1 and 10000),
  visibility public.prayer_visibility not null default 'group', status public.prayer_status not null default 'active',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index prayer_requests_group_idx on public.prayer_requests(group_id, status, created_at desc);
create table public.prayer_responses (
  id uuid primary key default gen_random_uuid(), prayer_request_id uuid not null references public.prayer_requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, created_at timestamptz not null default now(),
  unique (prayer_request_id, user_id)
);
create table public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  daily_verse_enabled boolean not null default true, daily_verse_time time not null default '08:00',
  group_notifications_enabled boolean not null default true, prayer_notifications_enabled boolean not null default true,
  timezone text not null default 'UTC', updated_at timestamptz not null default now()
);
create table public.reports (
  id uuid primary key default gen_random_uuid(), reporter_id uuid not null references public.profiles(id) on delete cascade,
  entity_type text not null check (entity_type in ('study_response','prayer_request')),
  entity_id uuid not null, reason text not null check (char_length(reason) between 1 and 2000),
  status public.report_status not null default 'open', created_at timestamptz not null default now()
);
create index reports_status_idx on public.reports(status, created_at);

create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger devotions_updated_at before update on public.daily_devotions for each row execute function public.set_updated_at();
create trigger notes_updated_at before update on public.verse_notes for each row execute function public.set_updated_at();
create trigger groups_updated_at before update on public.groups for each row execute function public.set_updated_at();
create trigger studies_updated_at before update on public.group_studies for each row execute function public.set_updated_at();
create trigger responses_updated_at before update on public.study_responses for each row execute function public.set_updated_at();
create trigger prayers_updated_at before update on public.prayer_requests for each row execute function public.set_updated_at();
create trigger preferences_updated_at before update on public.notification_preferences for each row execute function public.set_updated_at();

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(new.email, 'Reader'), '@', 1)), 80));
  insert into public.notification_preferences (user_id) values (new.id);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;
create function public.is_group_member(target_group_id uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.group_members where group_id = target_group_id and user_id = (select auth.uid()));
$$;
create function public.is_group_leader(target_group_id uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.groups where id = target_group_id and owner_id = (select auth.uid()))
  or exists (select 1 from public.group_members where group_id = target_group_id and user_id = (select auth.uid()) and role in ('leader','admin'));
$$;
create function public.protect_profile_role() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'Only administrators may change profile roles';
  end if;
  return new;
end; $$;
create trigger protect_profile_role before update of role on public.profiles for each row execute function public.protect_profile_role();
revoke all on function public.is_admin() from public;
revoke all on function public.is_group_member(uuid) from public;
revoke all on function public.is_group_leader(uuid) from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_group_member(uuid) to authenticated;
grant execute on function public.is_group_leader(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.bible_translations enable row level security;
alter table public.bible_books enable row level security;
alter table public.bible_verses enable row level security;
alter table public.daily_devotions enable row level security;
alter table public.saved_verses enable row level security;
alter table public.verse_highlights enable row level security;
alter table public.verse_notes enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_invites enable row level security;
alter table public.group_studies enable row level security;
alter table public.study_questions enable row level security;
alter table public.study_responses enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.prayer_responses enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.reports enable row level security;

create policy "profiles readable by authenticated" on public.profiles for select to authenticated using (true);
create policy "users update own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "active translations readable" on public.bible_translations for select to anon, authenticated using (is_active);
create policy "admins manage translations" on public.bible_translations for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "books readable" on public.bible_books for select using (true);
create policy "admins manage books" on public.bible_books for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "active verses readable" on public.bible_verses for select to anon, authenticated using (exists (select 1 from public.bible_translations t where t.id = translation_id and t.is_active));
create policy "admins manage verses" on public.bible_verses for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "published devotions readable" on public.daily_devotions for select to anon, authenticated using (status = 'published' and publish_date <= current_date);
create policy "admins manage devotions" on public.daily_devotions for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "users manage saved verses" on public.saved_verses for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "users manage highlights" on public.verse_highlights for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "users manage notes" on public.verse_notes for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "members read groups" on public.groups for select to authenticated using (owner_id = (select auth.uid()) or public.is_group_member(id));
create policy "users create groups" on public.groups for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "leaders update groups" on public.groups for update to authenticated using (public.is_group_leader(id)) with check (public.is_group_leader(id));
create policy "owners delete groups" on public.groups for delete to authenticated using (owner_id = (select auth.uid()));
create policy "members read membership" on public.group_members for select to authenticated using (public.is_group_member(group_id) or exists (select 1 from public.groups g where g.id = group_id and g.owner_id = (select auth.uid())));
create policy "leaders manage membership" on public.group_members for all to authenticated using (public.is_group_leader(group_id)) with check (public.is_group_leader(group_id));
create policy "leaders manage invites" on public.group_invites for all to authenticated using (public.is_group_leader(group_id)) with check (public.is_group_leader(group_id) and created_by = (select auth.uid()));
create policy "members read studies" on public.group_studies for select to authenticated using (public.is_group_member(group_id) or public.is_group_leader(group_id));
create policy "leaders manage studies" on public.group_studies for all to authenticated using (public.is_group_leader(group_id)) with check (public.is_group_leader(group_id));
create policy "members read questions" on public.study_questions for select to authenticated using (exists (select 1 from public.group_studies s where s.id = study_id and (public.is_group_member(s.group_id) or public.is_group_leader(s.group_id))));
create policy "leaders manage questions" on public.study_questions for all to authenticated using (exists (select 1 from public.group_studies s where s.id = study_id and public.is_group_leader(s.group_id))) with check (exists (select 1 from public.group_studies s where s.id = study_id and public.is_group_leader(s.group_id)));
create policy "members read responses" on public.study_responses for select to authenticated using (exists (select 1 from public.study_questions q join public.group_studies s on s.id = q.study_id where q.id = question_id and (public.is_group_member(s.group_id) or public.is_group_leader(s.group_id))));
create policy "members create responses" on public.study_responses for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.study_questions q join public.group_studies s on s.id = q.study_id where q.id = question_id and public.is_group_member(s.group_id)));
create policy "authors or leaders update responses" on public.study_responses for update to authenticated using (user_id = (select auth.uid()) or exists (select 1 from public.study_questions q join public.group_studies s on s.id = q.study_id where q.id = question_id and public.is_group_leader(s.group_id))) with check (user_id = (select auth.uid()) or exists (select 1 from public.study_questions q join public.group_studies s on s.id = q.study_id where q.id = question_id and public.is_group_leader(s.group_id)));
create policy "authors or leaders delete responses" on public.study_responses for delete to authenticated using (user_id = (select auth.uid()) or exists (select 1 from public.study_questions q join public.group_studies s on s.id = q.study_id where q.id = question_id and public.is_group_leader(s.group_id)));
create policy "authorized members read prayers" on public.prayer_requests for select to authenticated using ((visibility = 'group' and public.is_group_member(group_id)) or public.is_group_leader(group_id));
create policy "members create prayers" on public.prayer_requests for insert to authenticated with check (user_id = (select auth.uid()) and public.is_group_member(group_id));
create policy "authors or leaders update prayers" on public.prayer_requests for update to authenticated using (user_id = (select auth.uid()) or public.is_group_leader(group_id)) with check (user_id = (select auth.uid()) or public.is_group_leader(group_id));
create policy "authors or leaders delete prayers" on public.prayer_requests for delete to authenticated using (user_id = (select auth.uid()) or public.is_group_leader(group_id));
create policy "authorized members read prayer responses" on public.prayer_responses for select to authenticated using (exists (select 1 from public.prayer_requests p where p.id = prayer_request_id and ((p.visibility = 'group' and public.is_group_member(p.group_id)) or public.is_group_leader(p.group_id))));
create policy "members record prayer response" on public.prayer_responses for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.prayer_requests p where p.id = prayer_request_id and public.is_group_member(p.group_id)));
create policy "users remove own prayer response" on public.prayer_responses for delete to authenticated using (user_id = (select auth.uid()));
create policy "users manage notification preferences" on public.notification_preferences for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "users submit reports" on public.reports for insert to authenticated with check (reporter_id = (select auth.uid()) and status = 'open');
create policy "users read own reports" on public.reports for select to authenticated using (reporter_id = (select auth.uid()) or public.is_admin());
create policy "admins manage reports" on public.reports for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.bible_translations, public.bible_books, public.bible_verses, public.daily_devotions to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant all on public.saved_verses, public.verse_highlights, public.verse_notes, public.groups, public.group_members,
  public.group_invites, public.group_studies, public.study_questions, public.study_responses, public.prayer_requests,
  public.prayer_responses, public.notification_preferences, public.reports to authenticated;
grant insert, update, delete on public.bible_translations, public.bible_books, public.bible_verses, public.daily_devotions to authenticated;
