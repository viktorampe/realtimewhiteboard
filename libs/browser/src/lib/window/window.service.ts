import { Injectable } from '@angular/core';
import { WindowServiceInterface } from './window.service.interface';

@Injectable({
  providedIn: 'root'
})
export class WindowService implements WindowServiceInterface {
  private nativeWindow = window;
  private windows: { [name: string]: Window };
  constructor() {}

  openWindow(name: string, url: string) {
    const openedWindow = this.nativeWindow.open(url, name);
    this.windows[name] = openedWindow;
  }
  closeWindow(name: string) {
    this.windows[name].close();
  }
}
