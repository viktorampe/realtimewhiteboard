import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EduContentBookInterface } from '../+models';

@Injectable({
  providedIn: 'root'
})
export class EduContentBookService {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<EduContentBookInterface[]> {
    return this.personApi
      .getData(userId, 'allowedEduContentBooks')
      .pipe(
        map(
          (res: { allowedEduContentBooks: EduContentBookInterface[] }) =>
            res.allowedEduContentBooks
        )
      );
  }
}
