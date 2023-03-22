export const MotionPresets = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } },
  scale: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } },
  slideUp: {
    initial: { x: 0, y: '100%' },
    animate: { x: 0, y: 0 },
    exit: { x: 0, y: '100%' },
    transition: { duration: 0.3 },
  },
  slideDown: {
    initial: { x: 0, y: '-100%' },
    animate: { x: 0, y: 0 },
    exit: { x: 0, y: '-100%' },
    transition: { duration: 0.3 },
  },
  slideLeft: {
    initial: { x: '100%', y: 0 },
    animate: { x: 0, y: 0 },
    exit: { x: '100%', y: 0 },
    transition: { duration: 0.3 },
  },
  slideRight: {
    initial: { x: '-100%', y: 0 },
    animate: { x: 0, y: 0 },
    exit: { x: '-100%', y: 0 },
    transition: { duration: 0.3 },
  },
  none: {},
};

export type MotionPreset = keyof typeof MotionPresets;
