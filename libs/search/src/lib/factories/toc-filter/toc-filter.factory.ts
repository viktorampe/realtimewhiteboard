import { Inject, Injectable, Type } from '@angular/core';
import {
  DalState,
  LearningAreaInterface,
  LearningAreaQueries,
  TocServiceInterface,
  TOC_SERVICE_TOKEN
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { PrimitivePropertiesKeys } from 'libs/utils/src/lib/types/generic.types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColumnFilterComponent } from '../../components/column-filter/column-filter.component';
import {
  SearchFilterComponentInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TocFilterFactory implements SearchFilterFactory {
  constructor(
    @Inject(TOC_SERVICE_TOKEN) private tocService: TocServiceInterface,
    private store: Store<DalState>
  ) {}

  public getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    const learningAreaFilter = this.store
      .select(LearningAreaQueries.getAllEntities)
      .pipe(
        map(areas => [
          this.getLearningAreaFilter(
            searchState,
            areas,
            ColumnFilterComponent,
            'hostLeft'
          )
        ])
      );

    return learningAreaFilter;
  }

  private getLearningAreaFilter(
    searchState: SearchStateInterface,
    learningAreas: Dictionary<LearningAreaInterface>,
    component: Type<SearchFilterComponentInterface>,
    domHost: string,
    options?: any
  ): SearchFilterInterface {
    return {
      criteria: {
        name: 'LearningArea',
        label: 'Leergebieden',
        keyProperty: 'id',
        displayProperty: 'name',
        values: Object.values(learningAreas).map(area => ({
          data: area,
          selected: this.isSelectedInSearchState(
            area,
            'LearningArea',
            'id',
            searchState
          )
        }))
      },
      component,
      domHost,
      options
    };
  }

  private isSelectedInSearchState<T>(
    object: T,
    name: string,
    keyProperty: PrimitivePropertiesKeys<T>,
    searchState: SearchStateInterface
  ): boolean {
    return searchState.filterCriteriaSelections
      .get(name)
      .includes((object[keyProperty] as unknown) as string | number);
  }
}
