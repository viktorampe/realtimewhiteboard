import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnlockedBoekeGroupServiceInterface } from './unlocked-boeke-group.interface';

@Injectable({
  providedIn: 'root'
})
export class UnlockedBoekeGroupService
  implements UnlockedBoekeGroupServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<UnlockedBoekeGroupInterface[]> {
    return this.personApi
      .getData(userId, 'unlockedBoekeGroups')
      .pipe(
        map(
          (res: { unlockedBoekeGroups: UnlockedBoekeGroupInterface[] }) =>
            res.unlockedBoekeGroups
        )
      );
  }
}
