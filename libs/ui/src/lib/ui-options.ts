import { InjectionToken } from '@angular/core';

export interface UiOptions {
  footerHeight: number;
}
export const UI_OPTIONS = new InjectionToken('ui-options');
