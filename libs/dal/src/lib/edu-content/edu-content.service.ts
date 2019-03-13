import { Injectable } from '@angular/core';
import { SearchResultInterface, SearchStateInterface } from '@campus/search';
import { EduContentApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EduContentInterface } from '../+models/EduContent.interface';
import { EduContentServiceInterface } from './edu-content.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EduContentService implements EduContentServiceInterface {
  constructor(
    private personApi: PersonApi,
    private eduContentApi: EduContentApi
  ) {}

  getAllForUser(userId: number): Observable<EduContentInterface[]> {
    return this.personApi
      .getData(userId, 'eduContents')
      .pipe(
        map((res: { eduContents: EduContentInterface[] }) => res.eduContents)
      );
  }

  search(state: SearchStateInterface): Observable<SearchResultInterface> {
    return this.eduContentApi
      .search(state)
      .pipe(map((res: { results: SearchResultInterface }) => res.results));
  }
  autoComplete(state: SearchStateInterface): Observable<String[]> {
    throw new Error('Method not implemented.');
  }
}
