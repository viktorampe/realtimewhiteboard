import { InjectionToken } from '@angular/core';

export interface UiOptionsInterface {
  footerHeight?: number;
  backdrop?: {
    safeMargin?: number;
  };
}
export const UI_OPTIONS = new InjectionToken('ui-options');
