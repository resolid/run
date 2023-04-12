import type { MotionState } from '@motionone/dom';
import { createContext } from 'solid-js';

export const ParentContext = createContext<MotionState>();

export type PresenceState = () => boolean;

export const PresenceContext = createContext<PresenceState>();
