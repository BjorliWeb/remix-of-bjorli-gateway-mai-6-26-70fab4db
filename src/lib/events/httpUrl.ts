// App-side entry point for the shared http(s) link rules (also used by Edge Functions).
export { isHttpUrl, normalizeHttpUrl, safeHttpUrl, MAX_LINK_LENGTH } from '../../../supabase/functions/_shared/httpUrl';
