// step-types.ts — re-export shared constants to keep single source of truth
export { STEP_TYPES } from 'chrome-ai-bridge-shared';
export type StepTypeConst =
  (typeof import('chrome-ai-bridge-shared'))['STEP_TYPES'][keyof (typeof import('chrome-ai-bridge-shared'))['STEP_TYPES']];
