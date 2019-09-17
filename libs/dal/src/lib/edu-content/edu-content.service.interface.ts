import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SearchResultInterface,
  SearchStateInterface
} from '../+external-interfaces';
import { EduContentInterface } from '../+models';

export const EDU_CONTENT_SERVICE_TOKEN = new InjectionToken(
  'EduContentService'
);
export interface EduContentServiceInterface {
  getAllForUser(userId: number): Observable<EduContentInterface[]>;
  getGeneralEduContentForBookId(
    bookId: number
  ): Observable<EduContentInterface[]>;
  search(state: SearchStateInterface): Observable<SearchResultInterface>;
  autoComplete(state: SearchStateInterface): Observable<string[]>;
}
