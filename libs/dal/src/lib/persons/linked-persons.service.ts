import { Injectable, InjectionToken } from '@angular/core';

export const LINKED_PERSON_SERVICE_TOKEN = new InjectionToken(
  'LinkedPersonService'
);

// tslint:disable-next-line:no-empty-interface
export interface LinkedPersonServiceInterface {}

@Injectable({
  providedIn: 'root'
})
export class LinkedPersonService implements LinkedPersonServiceInterface {
  constructor() {}
}
