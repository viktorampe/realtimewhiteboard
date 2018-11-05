import { Injectable, InjectionToken } from '@angular/core';

export const LINKEDPERSON_SERVICE_TOKEN = new InjectionToken(
  'LinkedPersonsService'
);

// tslint:disable-next-line:no-empty-interface
export interface LinkedPersonsServiceInterface {}

@Injectable({
  providedIn: 'root'
})
export class LinkedPersonsService {
  constructor() {}
}
