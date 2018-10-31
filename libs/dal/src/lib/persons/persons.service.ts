import { Injectable, InjectionToken } from '@angular/core';

export const PERSON_SERVICE_TOKEN = new InjectionToken('PersonsService');

// tslint:disable-next-line:no-empty-interface
export interface PersonServiceInterface {}

@Injectable({
  providedIn: 'root'
})
export class PersonsService implements PersonServiceInterface {
  constructor() {}
}
