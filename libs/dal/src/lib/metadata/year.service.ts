import { Injectable } from '@angular/core';
import { EduContentBookApi, YearApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EduContentBookInterface, YearInterface } from '../+models';
import { YearServiceInterface } from './year.service.interface';

@Injectable({
  providedIn: 'root'
})
export class YearService implements YearServiceInterface {
  constructor(
    private yearApi: YearApi,
    private eduContentBookApi: EduContentBookApi
  ) {}

  getAll(): Observable<YearInterface[]> {
    return this.yearApi.find<YearInterface>();
  }

  getAllByMethodIds(methodIds: number[]): Observable<YearInterface[]> {
    return this.eduContentBookApi
      .find({
        where: { methodId: { inq: methodIds } },
        include: [{ relation: 'years' }]
      })
      .pipe(
        map((books: EduContentBookInterface[]) =>
          Array.from(
            new Set(books.reduce((acc, book) => [...acc, ...book.years], []))
          ).sort((a, b) => a.id - b.id)
        )
      );
  }
}
