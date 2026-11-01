create table if not exists public.custom_questions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references public.users(id) on delete cascade,
  sheet_id text not null,
  pattern_id text not null,
  title text not null check (char_length(title) between 1 and 200),
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard', 'Uncategorized')),
  url text,
  created_at timestamp with time zone default now()
);

create index if not exists custom_questions_user_sheet_idx
  on public.custom_questions(user_id, sheet_id, created_at);

alter table public.custom_questions enable row level security;
