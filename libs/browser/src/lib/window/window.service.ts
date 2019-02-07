import { Inject, Injectable, InjectionToken } from '@angular/core';
import { WindowServiceInterface } from './window.service.interface';

export const WINDOW = new InjectionToken('WindowToken', {
  providedIn: 'root',
  factory: () => window
});

/**
 * Class window service is used to add additional services to the native window.
 * When you need native window functionality, inject WINDOW instead
 */
@Injectable({
  providedIn: 'root'
})
export class WindowService implements WindowServiceInterface {
  private _openedWindows: { [name: string]: Window } = {};
  constructor(@Inject(WINDOW) private nativeWindow: Window) {}

  openWindow(name: string, url: string) {
    const openedWindow = this.nativeWindow.open(url, name);
    this._openedWindows[name] = openedWindow;
  }
  closeWindow(name: string) {
    if (this._openedWindows[name]) {
      this._openedWindows[name].close();
      delete this._openedWindows[name];
    }
  }

  get openedWindows(): { [name: string]: Window } {
    return this._openedWindows;
  }
}
