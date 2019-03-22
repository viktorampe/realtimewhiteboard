import { Inject, Injectable, Type } from '@angular/core';
import {
  DalState,
  EduContentTOCInterface,
  LearningAreaQueries,
  MethodQueries,
  TocServiceInterface,
  TOC_SERVICE_TOKEN
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
import { map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import {
  YearServiceInterface,
  YEAR_SERVICE_TOKEN
} from './../../../../../../libs/dal/src/lib/metadata/year.service.interface';

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

  // caches tree as a map
  // only contains values if a tree was needed at least once
  private cachedTree: {
    searchState?: SearchStateInterface;
    treeMap?: Map<number, EduContentTOCInterface[]>;
  } = {};

  // emits on update of cahcedtree
  private treeFilters = new BehaviorSubject<SearchFilterInterface[]>([]);

  constructor(
    private store: Store<DalState>,
    @Inject(TOC_SERVICE_TOKEN) private tocService: TocServiceInterface,
    @Inject(YEAR_SERVICE_TOKEN) private yearService: YearServiceInterface
  ) {}

  public getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    const selections = searchState.filterCriteriaSelections;
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
    if (selections.has(LEARNING_AREA)) {
      // ... show the filter for years
      const learningAreaId = selections.get(LEARNING_AREA)[0] as number;

      const years = this.store.pipe(
        // look up the methods associated with the learningArea
        select(MethodQueries.getByLearningAreaId, {
          learningAreaId
        }),
        switchMap(methodArray =>
          // get the years that have books for those methods
          this.yearService.getAllByMethodIds(
            methodArray.map(method => method.id)
          )
        )
      );

      const yearFilter = years.pipe(
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
      if (selections.has(YEAR)) {
        // ... show the filter for methods

        // TODO -> won't I need the yearId somehow?
        // Is this situation possible?
        // there are 2 methods
        // one for years [1,2,3]
        // and one for years [5]
        // the range of selected years will be [1,2,3,5]
        // suppose the user selects 5
        // how do I know that I only need to show method 2?
        const methodFilter = this.store.pipe(
          select(MethodQueries.getByLearningAreaId, {
            learningAreaId
          }),
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
        if (selections.has(METHOD)) {
          if (this.treeCacheNeedsUpdate(searchState)) {
            // update the cached tree
            // and wait for new value to emit new filters
            this.updateTreeCache(searchState).subscribe(() =>
              this.treeFilters.next(
                this.getFiltersForTree(searchState, this.cachedTree.treeMap)
              )
            );
          } else {
            this.treeFilters.next(
              this.getFiltersForTree(searchState, this.cachedTree.treeMap)
            );
          }

          // update the searchState in the cache
          this.cachedTree.searchState = searchState;

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
    treeMap: Map<number, EduContentTOCInterface[]>
  ): SearchFilterInterface[] {
    if (!treeMap || !searchState) return;

    // filter for top level of tree
    const filterForTree = this.getFilter(
      searchState,
      treeMap.get(0),
      TOC,
      'Inhoudstafel',
      'id',
      'title',
      this.filterComponent,
      this.domHost
    );

    let filtersForBranches = [];
    if (searchState.filterCriteriaSelections.has(TOC)) {
      const selectedTocId = searchState.filterCriteriaSelections.get(
        TOC
      )[0] as number;

      const tocs = treeMap.get(selectedTocId);

      // filter for branches
      // this creates the filter for the level after the current branch
      filtersForBranches = tocs.reduce((acc, toc) => {
        if (toc.children) {
          acc.push(
            this.getFilter(
              searchState,
              toc.children,
              TOC,
              'Inhoudstafel',
              'id',
              'title',
              this.filterComponent,
              this.domHost
            )
          );
        }
        return acc;
      }, []);
    }

    return [filterForTree, ...filtersForBranches];
  }

  private updateTreeCache(
    searchState: SearchStateInterface
  ): Observable<boolean> {
    const selections = searchState.filterCriteriaSelections;
    const yearId = selections.get(YEAR)[0] as number;
    const methodId = selections.get(METHOD)[0] as number;

    const updatedTreeMap = this.getTree(yearId, methodId).pipe(
      take(1),
      // calculate tree
      map(tree => this.getTreeMap(tree)),
      // update cache
      tap(treeMap => (this.cachedTree.treeMap = treeMap)),
      mapTo(true)
    );

    return updatedTreeMap;
  }

  // returns a map of all branches in the tree
  // example (with ids for brevity):
  // tree:
  // 1
  //  - 2
  //    - 5
  //  - 3
  // 4
  // Map { 0 => [ 1, 4 ], 1 => [1], 2 => [ 1, 2 ], 5 => [ 1, 2, 5 ], 3 => [ 1, 3 ], 4 => [4] }
  // the values in the arrays are the branches, top to bottom
  // id = 0 is original tree
  private getTreeMap(
    tree: EduContentTOCInterface[],
    treeMap: Map<number, EduContentTOCInterface[]> = new Map(),
    parentBranches: EduContentTOCInterface[] = []
  ): Map<number, EduContentTOCInterface[]> {
    // no parentBranches -> 1st time executed
    // set original tree as id:0
    if (!parentBranches.length) treeMap.set(0, tree);

    tree.forEach(branch => {
      // add own id to map
      treeMap.set(branch.id, [...parentBranches, branch]);

      // let children do the same
      if (Array.isArray(branch.children)) {
        this.getTreeMap(branch.children, treeMap, [...parentBranches, branch]);
      }
    });

    return treeMap;
  }

  private treeCacheNeedsUpdate(searchState): boolean {
    const newSelections = searchState.filterCriteriaSelections;

    //does the new selection contain enough values?
    if (
      !(
        newSelections.has(LEARNING_AREA) &&
        newSelections.has(YEAR) &&
        newSelections.has(METHOD)
      )
    ) {
      return false;
    }

    // if there are no old values -> update
    if (!this.cachedTree.searchState) {
      return true;
    }

    const oldSelections = this.cachedTree.searchState.filterCriteriaSelections;

    // has at least one of the values changed
    return !(
      oldSelections.get(LEARNING_AREA) === newSelections.get(LEARNING_AREA) &&
      oldSelections.get(YEAR) === newSelections.get(YEAR) &&
      oldSelections.get(METHOD) === newSelections.get(METHOD)
    );
  }
}
