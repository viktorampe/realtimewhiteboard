import { Inject, Injectable, Type } from '@angular/core';
import {
  DalState,
  LearningAreaQueries,
  MethodQueries,
  TocServiceInterface,
  TOC_SERVICE_TOKEN,
  YearQueries
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { PrimitivePropertiesKeys } from 'libs/utils/src/lib/types/generic.types';
import { combineLatest, Observable } from 'rxjs';
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
  private filterComponent = ColumnFilterComponent;
  private domHost = 'hostLeft';

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
        map(entities =>
          this.getFilter(
            searchState,
            entities,
            'LearningArea',
            'Leergebieden',
            'id',
            'name',
            this.filterComponent,
            this.domHost
          )
        )
      );

    const yearFilter = this.store
      .select(YearQueries.getAllEntities)
      .pipe(
        map(entities =>
          this.getFilter(
            searchState,
            entities,
            'Year',
            'Jaren',
            'id',
            'name',
            this.filterComponent,
            this.domHost
          )
        )
      );

    const methodFilter = this.store
      .select(MethodQueries.getAllEntities)
      .pipe(
        map(entities =>
          this.getFilter(
            searchState,
            entities,
            'Method',
            'Methodes',
            'id',
            'name',
            this.filterComponent,
            this.domHost
          )
        )
      );

    const filters = [];
    if (searchState.filterCriteriaSelections.has('LearningArea')) {
      filters.push(learningAreaFilter);

      if (searchState.filterCriteriaSelections.has('Year')) {
        filters.push(yearFilter);

        if (searchState.filterCriteriaSelections.has('Method')) {
          filters.push(methodFilter);
        }
      }
    }

    return combineLatest(filters);
  }

  private getFilter<T>(
    searchState: SearchStateInterface,
    entities: Dictionary<T>,
    entityName: string,
    entityLabel: string,
    entityKeyProperty: PrimitivePropertiesKeys<T>,
    entityDisplayProperty: PrimitivePropertiesKeys<T>,
    component: Type<SearchFilterComponentInterface>,
    domHost: string,
    options?: any
  ): SearchFilterInterface {
    return {
      criteria: {
        name: entityName,
        label: entityLabel,
        keyProperty: entityKeyProperty as string,
        displayProperty: entityDisplayProperty as string,
        values: Object.values(entities).map(entity => ({
          data: entity,
          selected: this.isSelectedInSearchState(
            entity,
            entityName,
            entityKeyProperty,
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
