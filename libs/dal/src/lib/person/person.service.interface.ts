import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonInterface } from '../+models';

export const PERSON_SERVICE_TOKEN = new InjectionToken('PersonService');

export interface PersonServiceInterface {
  findById(userId: number): Observable<PersonInterface>;
}
