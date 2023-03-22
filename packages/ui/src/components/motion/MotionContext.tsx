import { createContext } from 'solid-js';
import type { MotionState } from '@motionone/dom';

export const ParentContext = createContext<MotionState>();

export type PresenceState = () => boolean;

export const PresenceContext = createContext<PresenceState>();
