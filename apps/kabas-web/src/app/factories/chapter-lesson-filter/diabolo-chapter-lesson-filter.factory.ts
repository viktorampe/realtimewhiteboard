import { Injectable, InjectionToken } from '@angular/core';
import { DalState, DiaboloPhaseQueries } from '@campus/dal';
import {
  ButtonToggleFilterComponent,
  SearchStateInterface
} from '@campus/search';
import { Store } from '@ngrx/store';
import { ChapterLessonFilterFactory } from './chapter-lesson-filter.factory';

export const DIABOLO_CHAPTER_LESSON_FILTER_FACTORY_TOKEN = new InjectionToken(
  'DiaboloChapterLessonFilterFactory'
);

@Injectable({
  providedIn: 'root'
})
export class DiaboloChapterLessonFilterFactory extends ChapterLessonFilterFactory {
  protected filterSortOrder = ['eduContentProductType', 'diaboloPhase'];

  constructor(public store: Store<DalState>) {
    super(store);

    this.filterQueries['diaboloPhase'] = {
      query: DiaboloPhaseQueries.getAll,
      name: 'diaboloPhase',
      label: 'Diabolo-fase',
      component: ButtonToggleFilterComponent,
      displayProperty: 'icon',
      options: { multiple: true }
    };
  }

  protected createFilters(searchState: SearchStateInterface) {
    const filters = super.createFilters(searchState);

    const diaboloPhaseFilter$ = this.buildFilter('diaboloPhase', searchState);
    filters.push(diaboloPhaseFilter$);

    return filters;
  }
}
