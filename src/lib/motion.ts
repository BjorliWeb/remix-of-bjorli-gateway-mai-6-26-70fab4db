/**
 * Shared motion vocabulary for the public site.
 *
 * One easing curve (expo-out: fast start, long soft landing) and one
 * reveal pattern, so headlines, cards and sections all move the same way.
 * Mirrors `ease-out-expo` in tailwind.config.ts for CSS transitions.
 * Reduced-motion users get no movement: <MotionConfig reducedMotion="user">
 * in Layout.tsx turns transform animations off globally.
 */
import type { Variants } from 'framer-motion';

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Section/card reveal: short travel, long ease, light stagger by index. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: Math.min(i, 6) * 0.07, ease: EASE_OUT_EXPO },
  }),
};

/** Shared whileInView viewport: trigger a little after the edge enters. */
export const REVEAL_VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;
