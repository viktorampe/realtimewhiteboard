import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EduContentInterface } from '../+models/EduContent.interface';
import { EduContentServiceInterface } from './edu-content.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EduContentService implements EduContentServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<EduContentInterface[]> {
    return this.personApi
      .getData(userId, 'eduContents')
      .pipe(
        map((res: { eduContents: EduContentInterface[] }) => res.eduContents)
      );
  }
}
