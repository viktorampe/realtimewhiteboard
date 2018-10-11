import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnlockedContentInterface } from '../+models';
import { UnlockedContentServiceInterface } from './unlocked-content.service.interface';

@Injectable({
  providedIn: 'root'
})
export class UnlockedContentService implements UnlockedContentServiceInterface {
  getAllForUser(userId: number): Observable<UnlockedContentInterface[]> {
    return this.personApi
      .getData(userId, 'unlockedContents')
      .pipe(
        map(
          (res: { unlockedContents: UnlockedContentInterface[] }) =>
            res.unlockedContents
        )
      );
  }

  constructor(private personApi: PersonApi) {}
}
