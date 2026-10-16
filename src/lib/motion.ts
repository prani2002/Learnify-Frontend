import type { Transition, Variants } from "framer-motion";

export const spring: Transition = { type: "spring", stiffness: 260, damping: 28, mass: 0.9 };
export const springSoft: Transition = { type: "spring", stiffness: 180, damping: 24 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: spring },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: spring },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export const cardHover = { y: -4, transition: springSoft };
export const buttonTap = { scale: 0.98 };
