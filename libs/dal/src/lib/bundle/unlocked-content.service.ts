import { Injectable } from '@angular/core';
import { PersonApi, UnlockedContentApi } from '@diekeure/polpo-api-angular-sdk';
import { forkJoin, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
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

  remove(unlockedContentId: number): Observable<boolean> {
    return this.unlockedContentApi
      .deleteById(unlockedContentId)
      .pipe(mapTo(true));
  }

  removeAll(unlockedContentIds: number[]): Observable<boolean> {
    return forkJoin(unlockedContentIds.map(id => this.remove(id))).pipe(
      mapTo(true)
    );
  }

  constructor(
    private personApi: PersonApi,
    private unlockedContentApi: UnlockedContentApi
  ) {}
}
