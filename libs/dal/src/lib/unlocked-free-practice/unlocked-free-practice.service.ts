import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { UnlockedFreePracticeServiceInterface } from '.';
import { UnlockedFreePracticeInterface } from '../+models';

@Injectable({
  providedIn: 'root'
})
export class UnlockedFreePracticeService
  implements UnlockedFreePracticeServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId): Observable<UnlockedFreePracticeInterface[]> {
    return this.personApi
      .getData(userId, 'unlockedFreePractices')
      .pipe(
        map(
          (res: { unlockedFreePractices: UnlockedFreePracticeInterface[] }) =>
            res.unlockedFreePractices
        )
      );
  }

  createUnlockedFreePractices(
    userId: number,
    unlockedFreePractices: UnlockedFreePracticeInterface[]
  ): Observable<UnlockedFreePracticeInterface[]> {
    return this.personApi.createUnlockedFreePractices(
      userId,
      unlockedFreePractices
    );
  }

  deleteUnlockedFreePractices(
    userId: number,
    unlockedFreePracticeIds: number[]
  ): Observable<boolean> {
    return this.personApi
      .deleteManyUnlockedFreePracticeRemote(userId, unlockedFreePracticeIds)
      .pipe(mapTo(true));
  }
}
