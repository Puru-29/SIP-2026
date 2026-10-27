ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS address text NOT NULL DEFAULT '';
ALTER TABLE public.profiles ALTER COLUMN profile_completion SET DEFAULT 0;
UPDATE public.profiles SET profile_completion = 0 WHERE profile_completion = 20;