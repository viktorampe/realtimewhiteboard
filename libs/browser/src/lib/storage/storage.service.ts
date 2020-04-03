import { Inject, Injectable, InjectionToken } from '@angular/core';
import { StorageServiceInterface } from './storage.service.interface';

export function _localStorage() {
  return localStorage;
}
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: _localStorage
});

@Injectable({
  providedIn: 'root'
})
export class StorageService implements StorageServiceInterface {
  constructor(@Inject(BROWSER_STORAGE) private storage) {}

  get(key: string) {
    return this.storage.getItem(key);
  }

  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}
