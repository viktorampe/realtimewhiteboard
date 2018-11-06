import { InjectionToken } from '@angular/core';

export const WINDOW_SERVICE_TOKEN = new InjectionToken('window service');

export interface WindowServiceInterface {
  openWindow(name: string, url: string);
  closeWindow(name: string);
}
