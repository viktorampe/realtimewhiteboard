import { Injectable, InjectionToken } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PersonInterface } from '../+models';

export const PERSON_SERVICE_TOKEN = new InjectionToken('PersonService');

export interface PersonServiceInterface {
  getAllForUser(userId: number): Observable<PersonInterface[]>;
  checkUniqueUsername(userId: number, username: string): Observable<boolean>;
  checkUniqueEmail(userId: number, email: string): Observable<boolean>;
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

  checkUniqueUsername(userId: number, username: string): Observable<boolean> {
    return this.personApi.checkUnique(userId, 'username', username);
  }

  checkUniqueEmail(userId: number, email: string): Observable<boolean> {
    return this.personApi.checkUnique(userId, 'email', email);
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
