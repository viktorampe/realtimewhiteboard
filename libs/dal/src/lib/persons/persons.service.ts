import { Injectable, InjectionToken } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonInterface } from '../+models';

export const PERSON_SERVICE_TOKEN = new InjectionToken('PersonService');

export interface PersonServiceInterface {
  getAllForUser(userId: number): Observable<PersonInterface[]>;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService implements PersonServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<PersonInterface[]> {
    return this.personApi
      .getData(userId, 'persons')
      .pipe(map((res: { persons: PersonInterface[] }) => res.persons));
  }
}
