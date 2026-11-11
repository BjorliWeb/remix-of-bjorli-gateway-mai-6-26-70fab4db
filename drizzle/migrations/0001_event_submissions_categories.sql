-- Multiple categories per event. `category` stays as a compatibility field
-- (always the first selected category) so code that only knows one category
-- keeps working unchanged.
ALTER TABLE public.event_submissions
  ADD COLUMN IF NOT EXISTS categories text[] NOT NULL DEFAULT '{}'::text[];

UPDATE public.event_submissions
   SET categories = ARRAY[category]
 WHERE cardinality(categories) = 0 AND category IS NOT NULL AND category <> '';

COMMENT ON COLUMN public.event_submissions.category IS
  'Compatibility field: mirrors categories[1]. New code reads/writes categories.';

CREATE OR REPLACE FUNCTION public.trg_event_submissions_sync_categories()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  cleaned text[];
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF cardinality(coalesce(NEW.categories, '{}'::text[])) = 0 THEN
      NEW.categories := ARRAY[NEW.category];
    END IF;
  ELSE
    IF NEW.categories IS DISTINCT FROM OLD.categories THEN
      NULL; -- new-style write: categories is the source of truth
    ELSIF NEW.category IS DISTINCT FROM OLD.category THEN
      -- old-style write (single category): replace the first category and
      -- keep any additional ones.
      NEW.categories := array_prepend(
        NEW.category,
        array_remove(array_remove(coalesce(OLD.categories, '{}'::text[]), OLD.category), NEW.category)
      );
    END IF;
  END IF;

  SELECT coalesce(array_agg(c ORDER BY ord), '{}'::text[]) INTO cleaned
  FROM (
    SELECT DISTINCT ON (c) c, ord
    FROM unnest(NEW.categories) WITH ORDINALITY AS u(c, ord)
    WHERE c IS NOT NULL AND btrim(c) <> ''
    ORDER BY c, ord
  ) s;

  IF cardinality(cleaned) = 0 THEN
    RAISE EXCEPTION 'categories_required' USING ERRCODE = '22023';
  END IF;
  IF cardinality(cleaned) > 6 THEN
    RAISE EXCEPTION 'too_many_categories' USING ERRCODE = '22023';
  END IF;

  NEW.categories := cleaned;
  NEW.category := cleaned[1];
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS event_submissions_sync_categories ON public.event_submissions;
CREATE TRIGGER event_submissions_sync_categories
  BEFORE INSERT OR UPDATE ON public.event_submissions
  FOR EACH ROW EXECUTE FUNCTION public.trg_event_submissions_sync_categories();