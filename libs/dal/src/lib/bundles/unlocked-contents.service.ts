import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnlockedContentInterface } from '../+models';
import { UnlockedContentsServiceInterface } from './unlocked-contents.service.interface';

@Injectable({
  providedIn: 'root'
})
export class UnlockedContentsService
  implements UnlockedContentsServiceInterface {
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
