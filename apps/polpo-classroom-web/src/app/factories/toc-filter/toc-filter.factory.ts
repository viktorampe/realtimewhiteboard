import { Inject, Injectable, Type } from '@angular/core';
import {
  DalState,
  EduContentBookInterface,
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
import { PrimitivePropertiesKeys } from '@campus/utils';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  map,
  shareReplay,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';

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
    @Inject(TOC_SERVICE_TOKEN) private tocService: TocServiceInterface
  ) {}

  public getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    const selections = searchState.filterCriteriaSelections;
    const filters: Observable<SearchFilterInterface>[] = [];
    let treeFiltersNeeded = false;

    // learningArea is the first step
    const learningAreaFilter = this.getLearningAreaFilter(searchState);
    filters.push(learningAreaFilter);

    // if a learningArea is selected...
    if (selections.has(LEARNING_AREA)) {
      // get all books in that learningArea, with years
      const booksWithYears$ = this.getBooksWithYears(searchState);

      // ... show the filter for years
      const yearFilter = this.getYearFilter(searchState, booksWithYears$);
      filters.push(yearFilter);

      // if a year is selected...
      if (selections.has(YEAR)) {
        // ... show the filter for methods

        const methodFilter = this.getMethodFilter(searchState, booksWithYears$);
        filters.push(methodFilter);

        // if a method is selected...
        if (selections.has(METHOD)) {
          // ... show the tree filter
          treeFiltersNeeded = true;

          // subscription will handle this.treeFilters
          this.updateCache(searchState, booksWithYears$);
        }
      }
    }

    if (treeFiltersNeeded) {
      // map all those filters to a single observable
      return combineLatest(this.treeFilters, ...filters).pipe(
        map(([treeFilterArray, ...filterArray]) => [
          ...filterArray,
          ...treeFilterArray
        ])
      );
    } else {
      return combineLatest(filters);
    }
  }

  private getLearningAreaFilter(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface> {
    return this.store.pipe(
      select(LearningAreaQueries.getAll),
      map(areas =>
        this.getFilter(
          searchState,
          areas,
          LEARNING_AREA,
          'Leergebieden',
          'id',
          'name',
          this.filterComponent,
          this.domHost
        )
      )
    );
  }

  private getBooksWithYears(
    searchState: SearchStateInterface
  ): Observable<EduContentBookInterface[]> {
    const learningAreaId = searchState.filterCriteriaSelections.get(
      LEARNING_AREA
    )[0] as number;

    return this.store.pipe(
      // look up the methods associated with the learningArea
      select(MethodQueries.getByLearningAreaId, {
        learningAreaId
      }),
      switchMap(methodArray =>
        // get the books for those methods, with the years attached
        this.tocService.getBooksByMethodIds(
          methodArray.map(method => method.id)
        )
      ),
      shareReplay(1)
    );
  }

  private getYearFilter(
    searchState: SearchStateInterface,
    booksWithYears: Observable<EduContentBookInterface[]>
  ): Observable<SearchFilterInterface> {
    return booksWithYears.pipe(
      // reduce to set of years
      map((books: EduContentBookInterface[]) =>
        Array.from(
          new Set(books.reduce((acc, book) => [...acc, ...book.years], []))
        ).sort((a, b) => a.id - b.id)
      ),
      map(years =>
        this.getFilter(
          searchState,
          years,
          YEAR,
          'Jaren',
          'id',
          'name',
          this.filterComponent,
          this.domHost
        )
      )
    );
  }

  private getMethodFilter(
    searchState: SearchStateInterface,
    booksWithYears: Observable<EduContentBookInterface[]>
  ): Observable<SearchFilterInterface> {
    const learningAreaId = searchState.filterCriteriaSelections.get(
      LEARNING_AREA
    )[0] as number;
    const selectedYearId = searchState.filterCriteriaSelections.get(
      YEAR
    )[0] as number;

    return this.store.pipe(
      select(MethodQueries.getByLearningAreaId, {
        learningAreaId
      }),
      withLatestFrom(booksWithYears),
      map(([methods, books]) => {
        const booksForYear = books.filter(book =>
          book.years.some(year => year.id === selectedYearId)
        );

        const filteredMethods = methods.filter(
          method =>
            booksForYear.filter(
              book =>
                book.methodId === method.id &&
                book.years.some(year => year.id === selectedYearId)
            ).length
        );

        return this.getFilter(
          searchState,
          filteredMethods,
          METHOD,
          'Methodes',
          'id',
          'name',
          this.filterComponent,
          this.domHost
        );
      })
    );
  }

  private updateCache(
    searchState: SearchStateInterface,
    booksWithYears: Observable<EduContentBookInterface[]>
  ) {
    if (this.treeCacheNeedsUpdate(searchState)) {
      // update the cached tree
      // and wait for new value to emit new filters
      this.updateTreeCache(searchState, booksWithYears).subscribe(treeMap =>
        this.treeFilters.next(this.getFiltersForTree(searchState, treeMap))
      );
    } else {
      this.treeFilters.next(
        this.getFiltersForTree(searchState, this.cachedTree.treeMap)
      );
    }

    // update the searchState in the cache
    this.cachedTree.searchState = searchState;
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
          data: entity
        }))
      },
      component,
      domHost,
      options
    };
  }

  /**
   * Return TOC-tree, first level is already an array of branches
   *
   * @private
   * @param {number} yearId
   * @param {number} methodId
   * @returns {Observable<EduContentTOCInterface[]>}
   * @memberof TocFilterFactory
   */
  private getTree(
    yearId: number,
    methodId: number,
    booksWithYears: Observable<EduContentBookInterface[]>
  ): Observable<EduContentTOCInterface[]> {
    return booksWithYears.pipe(
      map(books =>
        books.find(
          book =>
            book.methodId === methodId &&
            book.years.some(year => year.id === yearId)
        )
      ),
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
    searchState: SearchStateInterface,
    booksWithYears: Observable<EduContentBookInterface[]>
  ): Observable<Map<number, EduContentTOCInterface[]>> {
    const selections = searchState.filterCriteriaSelections;
    const yearId = selections.get(YEAR)[0] as number;
    const methodId = selections.get(METHOD)[0] as number;

    return this.getTree(yearId, methodId, booksWithYears).pipe(
      take(1),
      // calculate tree
      map(tree => this.getTreeMap(tree)),
      // update cache
      tap(treeMap => (this.cachedTree.treeMap = treeMap))
    );
  }

  // returns a map of all branches in the tree
  // example (with ids for brevity, actual map values contain references):
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
