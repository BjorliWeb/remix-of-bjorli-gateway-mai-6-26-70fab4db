import type { Database } from '@/integrations/supabase/types';

export type AppRole = Database['public']['Enums']['app_role'];

/**
 * Roles allowed into the event-submission editor at /admin/innsendinger.
 *
 * This is an explicit capability list, NOT "admin plus extras". Moderator is
 * the editorial role: it gets exactly the permissions the current event
 * workflow needs, and nothing else. Any future editorial capability must be
 * added here (or granted explicitly in RLS) on purpose — never inherited.
 */
export const EDITOR_ROLES: readonly AppRole[] = ['admin', 'moderator'];

/**
 * True when the account may open the event-submission editor.
 * Mirrors the RLS condition on public.event_submissions.
 */
export function canAccessEditor(roles: readonly AppRole[] | null | undefined): boolean {
  return !!roles?.some((role) => EDITOR_ROLES.includes(role));
}

/**
 * True only for full administrators.
 *
 * Use this — never canAccessEditor — for anything a moderator must not do:
 * role management (user_roles), contact_messages, seo_meta, services,
 * alerts, operational_status.
 */
export function isFullAdmin(roles: readonly AppRole[] | null | undefined): boolean {
  return !!roles?.includes('admin');
}
