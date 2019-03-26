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
import { BehaviorSubject, merge, Observable } from 'rxjs';
import {
  filter,
  map,
  mapTo,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
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

  // input from viewmodel
  // base for all other streams
  private searchState$ = new BehaviorSubject<SearchStateInterface>(null);

  // private learningAreafilter$: Observable<SearchFilterInterface>;
  // private booksWithYears$: Observable<EduContentBookInterface[]>;
  // private yearfilter$: Observable<SearchFilterInterface>;
  // private methodfilter$: Observable<SearchFilterInterface>;
  // private treefilters$: Observable<SearchFilterInterface[]>;

  // output for viewmodel
  private filters$: Observable<SearchFilterInterface[]>;

  constructor(
    private store: Store<DalState>,
    @Inject(TOC_SERVICE_TOKEN) private tocService: TocServiceInterface
  ) {
    this.setupStreams();
  }

  private setupStreams() {
    const searchStateDiff$ = this.searchState$.pipe(
      startWith(null),
      pairwise(),
      shareReplay(1)
    );

    const learningAreafilter$ = this.searchState$.pipe(
      switchMap(searchstate => this.getLearningAreaFilter(searchstate))
    );

    const booksWithYears$ = searchStateDiff$.pipe(
      filter(searchStateDiff =>
        this.hasSearchStateChanged(searchStateDiff, LEARNING_AREA)
      ),
      switchMap(([oldSearchstate, newSearchstate]) =>
        this.getBooksWithYears(newSearchstate)
      ),
      shareReplay(1)
    );

    const yearfilter$ = this.searchState$.pipe(
      filter(searchState =>
        this.hasSearchStateData(searchState, LEARNING_AREA)
      ),
      withLatestFrom(booksWithYears$),
      map(([searchState, books]) => this.getYearFilter(searchState, books))
    );

    const emptyYearFilter$: Observable<
      SearchFilterInterface
    > = this.searchState$.pipe(
      filter(
        searchState => !this.hasSearchStateData(searchState, LEARNING_AREA)
      ),
      mapTo(null)
    );

    const methodfilter$ = this.searchState$.pipe(
      filter(
        searchState =>
          this.hasSearchStateData(searchState, LEARNING_AREA) &&
          this.hasSearchStateData(searchState, YEAR)
      ),
      withLatestFrom(booksWithYears$),
      switchMap(([searchState, books]) =>
        this.getMethodFilter$(searchState, books)
      )
    );

    const emptyMethodfilter$ = this.searchState$.pipe(
      filter(
        searchState =>
          !(
            this.hasSearchStateData(searchState, LEARNING_AREA) &&
            this.hasSearchStateData(searchState, YEAR)
          )
      ),
      mapTo(null)
    );

    const treefilters$ = searchStateDiff$.pipe(
      filter(
        searchStateDiff =>
          this.hasSearchStateData(searchStateDiff[1], LEARNING_AREA) &&
          this.hasSearchStateData(searchStateDiff[1], YEAR) &&
          this.hasSearchStateData(searchStateDiff[1], METHOD) &&
          // has at least one of the values changed
          (this.hasSearchStateChanged(searchStateDiff, LEARNING_AREA) ||
            this.hasSearchStateChanged(searchStateDiff, YEAR) ||
            this.hasSearchStateChanged(searchStateDiff, METHOD))
      ),
      withLatestFrom(booksWithYears$),
      switchMap(([[oldSearchstate, newSearchstate], books]) => {
        return this.getTree(newSearchstate, books).pipe(
          map(tree =>
            this.getFiltersForTree(newSearchstate, this.getTreeMap(tree))
          )
        );
      })
    );

    const emptyTreefilters$ = searchStateDiff$.pipe(
      filter(
        searchStateDiff =>
          !(
            this.hasSearchStateData(searchStateDiff[1], LEARNING_AREA) &&
            this.hasSearchStateData(searchStateDiff[1], YEAR) &&
            this.hasSearchStateData(searchStateDiff[1], METHOD) &&
            // has at least one of the values changed
            (this.hasSearchStateChanged(searchStateDiff, LEARNING_AREA) ||
              this.hasSearchStateChanged(searchStateDiff, YEAR) ||
              this.hasSearchStateChanged(searchStateDiff, METHOD))
          )
      ),
      mapTo(null)
    );

    this.filters$ = this.searchState$.pipe(
      withLatestFrom(
        learningAreafilter$,
        merge(yearfilter$, emptyYearFilter$),
        merge(methodfilter$, emptyMethodfilter$),
        merge(treefilters$, emptyTreefilters$)
      ),
      map(
        ([
          searchState,
          learningAreaFilter,
          yearFilter,
          methodFilter,
          treeFilters
        ]) =>
          [learningAreaFilter, yearFilter, methodFilter, ...treeFilters]
            // filter out null values
            .filter(value => !!value)
      )
    );
  }

  public getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    this.searchState$.next(searchState);

    return this.filters$;
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
      )
    );
  }

  private getYearFilter(
    searchState: SearchStateInterface,
    booksWithYears: EduContentBookInterface[]
  ): SearchFilterInterface {
    // reduce to set of years
    const years = Array.from(
      new Set(booksWithYears.reduce((acc, book) => [...acc, ...book.years], []))
    ).sort((a, b) => a.id - b.id);

    return this.getFilter(
      searchState,
      years,
      YEAR,
      'Jaren',
      'id',
      'name',
      this.filterComponent,
      this.domHost
    );
  }

  private getMethodFilter$(
    searchState: SearchStateInterface,
    booksWithYears: EduContentBookInterface[]
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
      map(methods => {
        const booksForYear = booksWithYears.filter(book =>
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
    searchState: SearchStateInterface,
    booksWithYears: EduContentBookInterface[]
  ): Observable<EduContentTOCInterface[]> {
    const yearId = searchState.filterCriteriaSelections.get(YEAR)[0] as number;
    const methodId = searchState.filterCriteriaSelections.get(
      METHOD
    )[0] as number;

    const neededBook = booksWithYears.find(
      book =>
        book.methodId === methodId &&
        book.years.some(year => year.id === yearId)
    );

    return this.tocService.getTree(neededBook.id);
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

  private hasSearchStateChanged(
    [oldSearchState, newSearchState]: [
      SearchStateInterface,
      SearchStateInterface
    ],
    selectionKey: string
  ): boolean {
    // new searchState has sufficient data
    return (
      newSearchState.filterCriteriaSelections.has(selectionKey) &&
      newSearchState.filterCriteriaSelections.get(selectionKey).length === 1 &&
      // data differs enough from old searchState
      (!oldSearchState ||
        !oldSearchState.filterCriteriaSelections.has(selectionKey) ||
        !oldSearchState.filterCriteriaSelections.get(selectionKey).length ||
        oldSearchState.filterCriteriaSelections.get(selectionKey)[0] !==
          newSearchState.filterCriteriaSelections.get(selectionKey)[0])
    );
  }

  private hasSearchStateData(
    searchState: SearchStateInterface,
    selectionKey: string
  ): boolean {
    // new searchState has sufficient data
    return (
      searchState.filterCriteriaSelections.has(selectionKey) &&
      searchState.filterCriteriaSelections.get(selectionKey).length === 1
    );
  }
}
