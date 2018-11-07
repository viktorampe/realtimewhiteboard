import { Inject, Injectable, InjectionToken } from '@angular/core';
import { WindowServiceInterface } from './window.service.interface';

export const WINDOW = new InjectionToken('WindowToken', {
  providedIn: 'root',
  factory: () => window
});

@Injectable({
  providedIn: 'root'
})
export class WindowService implements WindowServiceInterface {
  private openedWindows: { [name: string]: Window } = {};
  constructor(@Inject(WINDOW) private nativeWindow: Window) {}

  openWindow(name: string, url: string) {
    const openedWindow = this.nativeWindow.open(url, name);
    this.openedWindows[name] = openedWindow;
  }
  closeWindow(name: string) {
    this.openedWindows[name].close();
    delete this.openedWindows[name];
  }
}
