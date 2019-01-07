import { Injectable, InjectionToken } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonInterface } from '../+models';

export const PERSON_SERVICE_TOKEN = new InjectionToken('PersonService');

export interface PersonServiceInterface {
  getAllForUser(userId: number): Observable<PersonInterface[]>;
  checkUniqueUsername(userId: number, username: string): Observable<boolean>;
  checkUniqueEmail(userId: number, email: string): Observable<boolean>;
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
    // watch out for the intellisense: checkUnique does not return an Observable<boolean>.
    // It returns Observable<{[key:string]:boolean}>
    return this.personApi.checkUnique(userId, 'username', username).pipe(
      map((response: any) => {
        return response.unique;
      })
    );
  }

  checkUniqueEmail(userId: number, email: string): Observable<boolean> {
    // watch out for the intellisense: checkUnique does not return an Observable boolean.
    // It returns Observable<{[key:string]:boolean}>
    return this.personApi.checkUnique(userId, 'email', email).pipe(
      map((response: any) => {
        return response.unique;
      })
    );
  }
}
