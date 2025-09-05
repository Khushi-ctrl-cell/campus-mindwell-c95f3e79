-- Harden access to analytics views to prevent public exposure
-- Ensure views use SECURITY INVOKER (already set previously, but safe to re-apply)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind='v' AND n.nspname='public' AND c.relname='admin_analytics'
  ) THEN
    EXECUTE 'ALTER VIEW public.admin_analytics SET (security_invoker = true)';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind='v' AND n.nspname='public' AND c.relname='appointment_analytics'
  ) THEN
    EXECUTE 'ALTER VIEW public.appointment_analytics SET (security_invoker = true)';
  END IF;
END $$;

-- Remove any implicit public/anon access and limit selection to authenticated only
REVOKE ALL ON TABLE public.admin_analytics FROM PUBLIC, anon;
REVOKE ALL ON TABLE public.appointment_analytics FROM PUBLIC, anon;
GRANT SELECT ON TABLE public.admin_analytics TO authenticated;
GRANT SELECT ON TABLE public.appointment_analytics TO authenticated;