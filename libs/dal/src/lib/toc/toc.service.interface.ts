import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EduContentBookInterface, EduContentTOCInterface } from '../+models';

export const TOC_SERVICE_TOKEN = new InjectionToken('TocService');

export interface TocServiceInterface {
  getBooksByYearAndMethods(
    yearId: number,
    methodIds: number[]
  ): Observable<EduContentBookInterface[]>;
  getTree(bookId: number): Observable<EduContentTOCInterface[]>;
  getTocsForBookId(bookId: number): Observable<EduContentTOCInterface[]>;
  getBooksByMethodIds(
    methodIds: number[]
  ): Observable<EduContentBookInterface[]>;
  getBooksByIds(bookIds: number[]): Observable<EduContentBookInterface[]>;
}
