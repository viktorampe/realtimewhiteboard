import { Inject, Injectable, Type } from '@angular/core';
import {
  DalState,
  EduContentTOCInterface,
  LearningAreaQueries,
  MethodQueries,
  TocServiceInterface,
  TOC_SERVICE_TOKEN,
  YearQueries
} from '@campus/dal';
import {
  ColumnFilterComponent,
  SearchFilterComponentInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { PrimitivePropertiesKeys } from 'libs/utils/src/lib/types/generic.types';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
    // learningArea is the first step
    filters.push(learningAreaFilter);

    // if a learningArea is selected...
    if (searchState.filterCriteriaSelections.has('LearningArea')) {
      // ... show the filter for years
      filters.push(yearFilter);

      // and so on
      if (searchState.filterCriteriaSelections.has('Year')) {
        filters.push(methodFilter);

        if (searchState.filterCriteriaSelections.has('Method')) {
          const tocTree = this.getTree(searchState);
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
    const key = searchState.filterCriteriaSelections.get(name);
    return key
      ? key.includes((object[keyProperty] as unknown) as string | number)
      : false;
  }

  private getTree(
    searchState: SearchStateInterface
  ): Observable<EduContentTOCInterface[]> {
    return this.tocService
      .getBooksByYearAndMethods(
        // users can only select a single value in a columnFilter
        searchState.filterCriteriaSelections.get('Year')[0] as number,
        // users can only select a single value in a columnFilter -> method expects array
        searchState.filterCriteriaSelections.get('Method') as number[]
      )
      .pipe(
        // this should return a single value
        map(books => books[0]),
        switchMap(book => this.tocService.getTree(book.id))
      );
  }
}
