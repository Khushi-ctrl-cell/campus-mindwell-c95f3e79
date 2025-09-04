-- Fix SECURITY DEFINER views by switching to SECURITY INVOKER and enforce admin-only analytics via RLS

-- 1) Create roles system (enum + table) if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'user_roles'
  ) THEN
    CREATE TABLE public.user_roles (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      role public.app_role NOT NULL,
      UNIQUE (user_id, role)
    );
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

    CREATE POLICY "Users can assign themselves user role"
    ON public.user_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id AND role = 'user'::public.app_role);
  END IF;
END $$;

-- 2) Helper to check roles (SECURITY DEFINER is OK here; it reads user_roles)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$fn$;

-- 3) Tighten RLS on analytics source tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='appointments' AND policyname='Authenticated users can view appointment analytics'
  ) THEN
    DROP POLICY "Authenticated users can view appointment analytics" ON public.appointments;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='appointments' AND policyname='Admins can view appointments for analytics'
  ) THEN
    CREATE POLICY "Admins can view appointments for analytics"
    ON public.appointments
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Authenticated users can view admin analytics'
  ) THEN
    DROP POLICY "Authenticated users can view admin analytics" ON public.chat_sessions;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Admins can view chat sessions for analytics'
  ) THEN
    CREATE POLICY "Admins can view chat sessions for analytics"
    ON public.chat_sessions
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- 4) Convert analytics views to SECURITY INVOKER (so they use the querying user's permissions)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind='v' AND n.nspname='public' AND c.relname='admin_analytics'
  ) THEN
    EXECUTE 'ALTER VIEW public.admin_analytics SET (security_invoker = true)';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind='v' AND n.nspname='public' AND c.relname='appointment_analytics'
  ) THEN
    EXECUTE 'ALTER VIEW public.appointment_analytics SET (security_invoker = true)';
  END IF;
END $$;

-- 5) Limit view access to authenticated role (RLS on base tables enforces admin-only data)
REVOKE ALL ON TABLE public.admin_analytics FROM anon;
REVOKE ALL ON TABLE public.appointment_analytics FROM anon;
GRANT SELECT ON TABLE public.admin_analytics TO authenticated;
GRANT SELECT ON TABLE public.appointment_analytics TO authenticated;