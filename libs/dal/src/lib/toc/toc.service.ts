import { Injectable } from '@angular/core';
import {
  EduContentBookApi,
  EduContentTOCApi
} from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { EduContentBookInterface, EduContentTOCInterface } from '../+models';
import { TocServiceInterface } from './toc.service.interface';

@Injectable()
export class TocService implements TocServiceInterface {
  constructor(
    private tocApi: EduContentTOCApi,
    private eduContentBookApi: EduContentBookApi
  ) {}

  getBooksByYearAndMethods(
    yearId: number,
    methodIds: number[]
  ): Observable<EduContentBookInterface[]> {
    return this.eduContentBookApi.find({
      where: { methodId: { inq: methodIds }, years: yearId },
      include: 'years'
    });
  }

  getTree(bookId: number): Observable<EduContentTOCInterface[]> {
    return this.tocApi.tree(bookId);
  }
}
