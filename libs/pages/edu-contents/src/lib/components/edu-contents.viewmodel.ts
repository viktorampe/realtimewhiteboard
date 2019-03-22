import { Inject, Injectable } from '@angular/core';
import {
  DalState,
  EduContentServiceInterface,
  EDU_CONTENT_SERVICE_TOKEN,
  LearningAreaInterface,
  LearningAreaQueries
} from '@campus/dal';
import { SearchStateInterface } from '@campus/search';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EduContentsViewModel {
  constructor(
    private store: Store<DalState>,
    @Inject(EDU_CONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface
  ) {}

  public getLearningAreaById(
    areaId: number
  ): Observable<LearningAreaInterface> {
    return this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }));
  }

  public requestAutoComplete(
    searchTerm: string,
    criteria: Map<string, (number | string)[]> = new Map()
  ): Observable<string[]> {
    const searchState: SearchStateInterface = {
      searchTerm,
      filterCriteriaSelections: criteria
    };
    return this.eduContentService.autoComplete(searchState);
  }
}
