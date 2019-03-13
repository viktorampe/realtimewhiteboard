import { Injectable } from '@angular/core';
import { SearchResultInterface, SearchStateInterface } from '@campus/search';
import {
  EduContentApi,
  EduContentTOCApi
} from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EduContentTOCInterface } from '../+models';
import { TocServiceInterface } from './toc.service.interface';

@Injectable()
export class TocService implements TocServiceInterface {
  constructor(
    private tocApi: EduContentTOCApi,
    private eduContentApi: EduContentApi
  ) {}

  getBooksByYearAndMethods(
    yearId: number,
    methodIds: number[]
  ): Observable<SearchResultInterface> {
    const state: SearchStateInterface = {
      searchTerm: '',
      filterCriteriaSelections: {}
    };
    return this.eduContentApi
      .search(state)
      .pipe(map((res: { results: SearchResultInterface }) => res.results));
  }
  getTree(bookId: number): Observable<EduContentTOCInterface[]> {
    return this.tocApi.tree(bookId);
  }
}
