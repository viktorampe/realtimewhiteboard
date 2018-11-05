import { Injectable, InjectionToken } from '@angular/core';

export const PERSON_SERVICE_TOKEN = new InjectionToken('PersonService');

// tslint:disable-next-line:no-empty-interface
export interface PersonServiceInterface {}

@Injectable({
  providedIn: 'root'
})
export class PersonService implements PersonServiceInterface {
  constructor() {}
}
