import { Injectable, InjectionToken } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PersonInterface } from '../+models';

export const PERSON_SERVICE_TOKEN = new InjectionToken('PersonService');

export interface PersonServiceInterface {
  getAllForUser(userId: number): Observable<PersonInterface[]>;
  updateUser(
    userId: number,
    changedProps: Partial<PersonInterface>
  ): Observable<boolean>;
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

  updateUser(
    userId: number,
    changedProps: Partial<PersonInterface>
  ): Observable<boolean> {
    return this.personApi.patchAttributes(userId, changedProps).pipe(
      map(_ => true),
      catchError(error => throwError(error))
    );
  }
}
