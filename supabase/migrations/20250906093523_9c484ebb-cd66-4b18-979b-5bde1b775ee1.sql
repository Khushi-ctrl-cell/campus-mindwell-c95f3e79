-- Secure admin analytics tables by enabling RLS and restricting SELECT to admins only

-- admin_analytics
DO $$
BEGIN
  -- Enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename AND c.relnamespace = 'public'::regnamespace
    JOIN pg_catalog.pg_class cls ON cls.oid = c.oid
    JOIN pg_catalog.pg_namespace nsp ON nsp.oid = cls.relnamespace
    WHERE t.schemaname = 'public' AND t.tablename = 'admin_analytics'
  ) THEN
    -- If admin_analytics is not a table (e.g., it's a view), raise a notice
    RAISE NOTICE 'admin_analytics is not a table; skipping RLS enable. If this is a view, consider securing via a SECURITY DEFINER function instead.';
  ELSE
    EXECUTE 'ALTER TABLE public.admin_analytics ENABLE ROW LEVEL SECURITY';
  END IF;
EXCEPTION WHEN others THEN
  -- In case admin_analytics is a view or materialized view, ALTER TABLE will fail; ignore with notice
  RAISE NOTICE 'Could not enable RLS on admin_analytics (might be a view). Consider replacing with a table or querying via a SECURITY DEFINER RPC.';
END $$;

-- Create/replace policy for admin_analytics (only applies if it's a table)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'admin_analytics' AND c.relkind = 'r' -- ordinary table
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view admin analytics" ON public.admin_analytics';
    EXECUTE 'CREATE POLICY "Admins can view admin analytics" ON public.admin_analytics FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;

-- appointment_analytics
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'appointment_analytics' AND c.relkind = 'r'
  ) THEN
    RAISE NOTICE 'appointment_analytics is not a table; skipping RLS enable. If this is a view, consider securing via a SECURITY DEFINER function instead.';
  ELSE
    EXECUTE 'ALTER TABLE public.appointment_analytics ENABLE ROW LEVEL SECURITY';
  END IF;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Could not enable RLS on appointment_analytics (might be a view). Consider replacing with a table or querying via a SECURITY DEFINER RPC.';
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'appointment_analytics' AND c.relkind = 'r'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view appointment analytics" ON public.appointment_analytics';
    EXECUTE 'CREATE POLICY "Admins can view appointment analytics" ON public.appointment_analytics FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;