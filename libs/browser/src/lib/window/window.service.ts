import { Injectable } from '@angular/core';
import { WindowServiceInterface } from './window.service.interface';

@Injectable({
  providedIn: 'root'
})
export class WindowService implements WindowServiceInterface {
  constructor() {}

  openWindow(name: string, url: string) {
    throw new Error('Method not implemented.');
  }
  closeWindow(name: string) {
    throw new Error('Method not implemented.');
  }
}
