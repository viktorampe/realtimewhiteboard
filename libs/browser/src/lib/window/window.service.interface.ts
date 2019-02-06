import { InjectionToken } from '@angular/core';

export const WINDOW_SERVICE_TOKEN = new InjectionToken('window service');

export interface WindowServiceInterface {
  readonly openedWindows: { [name: string]: Window };
  readonly window: Window;
  openWindow(name: string, url: string);
  closeWindow(name: string);
}
