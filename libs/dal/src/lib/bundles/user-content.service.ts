import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserContentInterface } from '../+models';
import { UserContentServiceInterface } from './user-content.service.interface';

@Injectable({
  providedIn: 'root'
})
export class UserContentService implements UserContentServiceInterface {
  getAllForUser(userId: number): Observable<UserContentInterface[]> {
    return this.personApi
      .getData(userId, 'userContents')
      .pipe(
        map((res: { userContents: UserContentInterface[] }) => res.userContents)
      );
  }

  constructor(private personApi: PersonApi) {}
}
