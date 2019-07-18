import { Injectable } from '@angular/core';
import { SearchResultInterface, SearchStateInterface } from '@campus/search';
import { MapObjectConversionService } from '@campus/utils';
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
    private eduContentApi: EduContentApi,
    private mapObjectConversionService: MapObjectConversionService
  ) {}

  getAllForUser(userId: number): Observable<EduContentInterface[]> {
    return this.personApi
      .getData(userId, 'eduContents')
      .pipe(
        map((res: { eduContents: EduContentInterface[] }) => res.eduContents)
      );
  }

  getGeneralEduContentsForBookId(
    bookId: number
  ): Observable<EduContentInterface[]> {
    return this.eduContentApi.getGeneralEduContentsForBookId(bookId);
  }

  search(state: SearchStateInterface): Observable<SearchResultInterface> {
    return this.eduContentApi
      .search({
        ...state,
        filterCriteriaSelections: this.mapObjectConversionService.mapToObject(
          state.filterCriteriaSelections
        )
      })
      .pipe(
        map(
          (res: {
            count: number;
            results: any[];
            filterCriteriaPredictions: {
              [key: string]: { [key: number]: number };
            };
          }) => {
            const returnValue: SearchResultInterface = {
              ...res,
              filterCriteriaPredictions: this.mapObjectConversionService.objectToMap(
                res.filterCriteriaPredictions,
                false, // first map key type is string
                true, // we want to convert first map value to map as wel
                true // second map key type is number
              )
            };

            return returnValue;
          }
        )
      );
  }
  autoComplete(state: SearchStateInterface): Observable<string[]> {
    return this.eduContentApi.autocomplete({
      ...state,
      filterCriteriaSelections: this.mapObjectConversionService.mapToObject(
        state.filterCriteriaSelections
      )
    });
  }
}
