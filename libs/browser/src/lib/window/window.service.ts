import { Injectable } from '@angular/core';
import { WindowServiceInterface } from './window.service.interface';

@Injectable({
  providedIn: 'root'
})
export class WindowService implements WindowServiceInterface {
  private nativeWindow = window;
  private openedWindows: { [name: string]: Window } = {};
  constructor() {}

  openWindow(name: string, url: string) {
    const openedWindow = this.nativeWindow.open(url, name);
    this.openedWindows[name] = openedWindow;
  }
  closeWindow(name: string) {
    this.openedWindows[name].close();
    delete this.openedWindows[name];
  }
}
