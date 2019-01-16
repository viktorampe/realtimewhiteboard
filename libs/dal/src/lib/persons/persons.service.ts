import { Injectable, InjectionToken } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PersonInterface } from '../+models';

export const PERSON_SERVICE_TOKEN = new InjectionToken('PersonService');

export interface PersonServiceInterface {
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

  checkUniqueUsername(userId: number, username: string): Observable<boolean> {
    // watch out for the intellisense: checkUnique does not return an Observable<boolean>.
    // It returns Observable<{[key:string]:boolean}>
    // TODO: type the response after SDK update
    return this.personApi.checkUnique(userId, 'username', username).pipe(
      map((response: any) => {
        return response.unique;
      })
    );
  }

  checkUniqueEmail(userId: number, email: string): Observable<boolean> {
    // watch out for the intellisense: checkUnique does not return an Observable boolean.
    // It returns Observable<{[key:string]:boolean}>
    // TODO: type the response after SDK update
    return this.personApi.checkUnique(userId, 'email', email).pipe(
      map((response: any) => {
        return response.unique;
      })
    );
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
