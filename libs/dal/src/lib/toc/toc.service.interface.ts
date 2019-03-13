import { InjectionToken } from '@angular/core';
import { SearchResultInterface } from '@campus/search';
import { Observable } from 'rxjs';
import { EduContentTOCInterface } from '../+models';

export const TOC_SERVICE_TOKEN = new InjectionToken('TocService');

export interface TocServiceInterface {
  getBooksByYearAndMethods(
    yearId: number,
    methodIds: number[]
  ): Observable<SearchResultInterface>;
  getTree(bookId: number): Observable<EduContentTOCInterface[]>;
}
