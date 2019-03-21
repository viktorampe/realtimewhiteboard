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
import { select, Store } from '@ngrx/store';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { PrimitivePropertiesKeys } from 'libs/utils/src/lib/types/generic.types';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

const LEARNING_AREA = 'learningArea';
const YEAR = 'year';
const METHOD = 'method';
const TOC = 'eduContentTOC';

@Injectable({
  providedIn: 'root'
})
export class TocFilterFactory implements SearchFilterFactory {
  private filterComponent = ColumnFilterComponent;
  private domHost = 'hostLeft';

  private cachedTree: {
    learningAreaId?: number;
    yearId?: number;
    methodId?: number;
    searchState?: SearchStateInterface;
    toc: BehaviorSubject<EduContentTOCInterface[]>;
  } = { toc: new BehaviorSubject<EduContentTOCInterface[]>([]) };

  private treeFilters = new BehaviorSubject<SearchFilterInterface[]>([]);

  constructor(
    private store: Store<DalState>,
    @Inject(TOC_SERVICE_TOKEN) private tocService: TocServiceInterface
  ) {
    this.cachedTree.toc.subscribe(tree => {
      this.treeFilters.next(
        this.getFiltersForTree(this.cachedTree.searchState, tree)
      );
    });
  }

  public getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    const filters: Observable<SearchFilterInterface>[] = [];
    let treeFilters: Observable<SearchFilterInterface[]> = null;

    // learningArea is the first step
    const learningAreaFilter = this.store.pipe(
      select(LearningAreaQueries.getAll),
      map(entities =>
        this.getFilter(
          searchState,
          entities,
          LEARNING_AREA,
          'Leergebieden',
          'id',
          'name',
          this.filterComponent,
          this.domHost
        )
      )
    );
    filters.push(learningAreaFilter);

    // if a learningArea is selected...
    if (searchState.filterCriteriaSelections.has(LEARNING_AREA)) {
      // ... show the filter for years
      const yearFilter = this.store.pipe(
        select(YearQueries.getAll),
        map(entities =>
          this.getFilter(
            searchState,
            entities,
            YEAR,
            'Jaren',
            'id',
            'name',
            this.filterComponent,
            this.domHost
          )
        )
      );
      filters.push(yearFilter);

      // if a year is selected...
      if (searchState.filterCriteriaSelections.has(YEAR)) {
        // ... show the filter for methods
        const methodFilter = this.store.pipe(
          select(MethodQueries.getAll), // TODO .select(MethodQueries.getByLearningAreaId, {learningAreaId})
          map(entities =>
            this.getFilter(
              searchState,
              entities,
              METHOD,
              'Methodes',
              'id',
              'name',
              this.filterComponent,
              this.domHost
            )
          )
        );
        filters.push(methodFilter);

        // if a method is selected...
        if (searchState.filterCriteriaSelections.has(METHOD)) {
          // update the cached tree
          // include a check if it is needed
          this.updateTreeCache(searchState);

          // ... show the tree filter
          // subscription will handle this.treeFilters
          treeFilters = this.treeFilters;
        }
      }
    }

    if (treeFilters) {
      // map all those filters to a single observable
      return combineLatest(combineLatest(filters), treeFilters).pipe(
        map(([filterArray, treeFilterArray]) => [
          ...filterArray,
          ...treeFilterArray
        ])
      );
    } else {
      return combineLatest(filters);
    }
  }

  private getFilter<T>(
    searchState: SearchStateInterface,
    entities: T[],
    entityName: string,
    entityLabel: string,
    entityKeyProperty: PrimitivePropertiesKeys<T>,
    entityDisplayProperty: PrimitivePropertiesKeys<T>,
    component: Type<SearchFilterComponentInterface>,
    domHost: string,
    options?: any
  ): SearchFilterInterface {
    if (!entities || !entities.length) return;

    return {
      criteria: {
        name: entityName,
        label: entityLabel,
        keyProperty: entityKeyProperty as string,
        displayProperty: entityDisplayProperty as string,
        values: entities.map(entity => ({
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
    obj: T,
    name: string,
    keyProperty: PrimitivePropertiesKeys<T>,
    searchState: SearchStateInterface
  ): boolean {
    const key = searchState.filterCriteriaSelections.get(name);
    return key
      ? key.includes((obj[keyProperty] as unknown) as string | number)
      : false;
  }

  private getTree(
    yearId: number,
    methodId: number
  ): Observable<EduContentTOCInterface[]> {
    return this.tocService
      .getBooksByYearAndMethods(
        // users can only select a single value in a columnFilter
        yearId,
        // users can only select a single value in a columnFilter -> method expects array
        [methodId]
      )
      .pipe(
        // this should return a single value
        map(books => books[0]),
        switchMap(book => this.tocService.getTree(book.id))
      );
  }

  private getFiltersForTree(
    searchState: SearchStateInterface,
    tree: EduContentTOCInterface[]
  ): SearchFilterInterface[] {
    if (!tree || !searchState) return;

    const treeFilter: SearchFilterInterface[] = [];
    let tocs = tree;

    let depth = 0;
    do {
      if (depth !== 0) {
        const selectedTOC = searchState.filterCriteriaSelections.get(
          TOC + '_' + (depth - 1)
        )[0];

        tocs = tocs.find(toc => toc.id === selectedTOC).children;
      }

      treeFilter.push(
        this.getFilter(
          searchState,
          tocs,
          TOC + '_' + depth,
          'Inhoudstafel',
          'id',
          'title',
          this.filterComponent,
          this.domHost
        )
      );

      depth++;
    } while (searchState.filterCriteriaSelections.has(TOC + '_' + (depth - 1)));

    return treeFilter;
  }

  private updateTreeCache(searchState: SearchStateInterface) {
    this.cachedTree.searchState = searchState;

    const selections = searchState.filterCriteriaSelections;
    if (
      // at least one of these values changes
      this.cachedTree.learningAreaId !==
        (selections.get(LEARNING_AREA)[0] as number) ||
      this.cachedTree.yearId !== (selections.get(YEAR)[0] as number) ||
      this.cachedTree.methodId !== (selections.get(METHOD)[0] as number)
    ) {
      // then update the cache
      this.cachedTree.learningAreaId = selections.get(
        LEARNING_AREA
      )[0] as number;
      this.cachedTree.yearId = selections.get(YEAR)[0] as number;
      this.cachedTree.methodId = selections.get(METHOD)[0] as number;

      // emit new value
      this.getTree(this.cachedTree.yearId, this.cachedTree.methodId)
        .pipe(take(1))
        .subscribe(tree => this.cachedTree.toc.next(tree));
    }
  }
}
