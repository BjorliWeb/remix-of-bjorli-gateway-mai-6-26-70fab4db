-- Synthetic, disposable local database only. Never execute against Cloud.
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role NOLOGIN BYPASSRLS;
CREATE SCHEMA auth;
GRANT USAGE ON SCHEMA public, auth TO anon, authenticated, service_role;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
  $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TABLE public.user_roles (user_id uuid NOT NULL, role public.app_role NOT NULL);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
INSERT INTO public.user_roles VALUES
  ('00000000-0000-0000-0000-000000000003', 'moderator'),
  ('00000000-0000-0000-0000-000000000004', 'admin');

CREATE TABLE public.weather_snapshot (
  kind text PRIMARY KEY, payload jsonb, fetched_at timestamptz, expires_at timestamptz,
  error_count integer NOT NULL DEFAULT 0, last_error text, locked_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.weather_snapshot TO anon, authenticated, service_role;
ALTER TABLE public.weather_snapshot ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read the stored forecast" ON public.weather_snapshot
  FOR SELECT TO public USING (true);

CREATE TABLE public.seo_meta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), page_slug text NOT NULL, title text NOT NULL,
  description text, og_image_url text, keywords text, updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.seo_meta TO anon, authenticated, service_role;
ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read SEO meta" ON public.seo_meta FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can insert SEO meta" ON public.seo_meta FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Only admins can update SEO meta" ON public.seo_meta FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, description text,
  slug text NOT NULL, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.services TO anon, authenticated, service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active services" ON public.services FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can insert services" ON public.services FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Only admins can update services" ON public.services FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

INSERT INTO public.weather_snapshot(kind, payload, last_error, locked_at)
 VALUES ('hourly', '{"hours":[{"temperatureC":-5}]}', 'INTERNAL_TEST_ONLY', now());
INSERT INTO public.seo_meta(page_slug, title) VALUES ('test-public', 'Published metadata');
INSERT INTO public.services(name, slug, is_active) VALUES
  ('Published test service', 'test-active', true),
  ('INACTIVE_TEST_ONLY', 'test-inactive', false);-- Stand-in for Fase 4 public.is_editor (role part only). MFA behaviour of the
-- real function is covered by test_editor_mfa.py; here admins count as verified.
CREATE FUNCTION public.is_editor(_role public.app_role) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS
  $$ SELECT public.has_role(auth.uid(), _role) $$;
REVOKE ALL ON FUNCTION public.is_editor(public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_editor(public.app_role) TO authenticated, service_role;
