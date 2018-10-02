import { Injectable, InjectionToken } from '@angular/core';

export const PersonServiceToken = new InjectionToken('PersonsService');

export interface PersonServiceInterface {}

@Injectable({
  providedIn: 'root'
})
export class PersonsService implements PersonServiceInterface {
  constructor() {}
}
