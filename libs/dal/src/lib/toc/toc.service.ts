import { Injectable } from '@angular/core';
import {
  EduContentBookApi,
  EduContentTOCApi
} from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EduContentBookInterface, EduContentTOCInterface } from '../+models';
import { TocServiceInterface } from './toc.service.interface';

@Injectable({
  providedIn: 'root'
})
export class TocService implements TocServiceInterface {
  constructor(
    private eduContentTOCApi: EduContentTOCApi,
    private eduContentBookApi: EduContentBookApi
  ) {}

  getBooksByYearAndMethods(
    yearId: number,
    methodIds: number[]
  ): Observable<EduContentBookInterface[]> {
    return this.eduContentBookApi
      .find({
        where: { methodId: { inq: methodIds } },
        include: [{ relation: 'years', scope: { where: { id: yearId } } }]
      })
      .pipe(
        map((books: EduContentBookInterface[]) =>
          books.filter(book => book.years.length)
        )
      );
  }

  getBooksByMethodIds(
    methodIds: number[]
  ): Observable<EduContentBookInterface[]> {
    return this.eduContentBookApi.find({
      where: { methodId: { inq: methodIds } },
      include: [{ relation: 'years' }]
    });
  }

  getTree(bookId: number): Observable<EduContentTOCInterface[]> {
    return this.eduContentTOCApi.tree(bookId);
  }

  getTocsForBookId(bookId: number): Observable<EduContentTOCInterface[]> {
    return this.eduContentTOCApi.find({ where: { treeId: bookId } });
  }

  getBooksByIds(bookIds: number[]): Observable<EduContentBookInterface[]> {
    return this.eduContentBookApi.find({ where: { id: { inq: bookIds } } });
  }
}
