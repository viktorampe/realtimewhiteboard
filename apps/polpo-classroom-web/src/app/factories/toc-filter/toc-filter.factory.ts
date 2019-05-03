import { Inject, Injectable, Type } from '@angular/core';
import {
  DalState,
  EduContentBookInterface,
  EduContentTOCInterface,
  LearningAreaQueries,
  MethodQueries,
  TocServiceInterface,
  TOC_SERVICE_TOKEN,
  YearInterface
} from '@campus/dal';
import {
  BreadcrumbFilterComponent,
  ColumnFilterComponent,
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { PrimitivePropertiesKeys } from '@campus/utils';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import {
  filter,
  map,
  mapTo,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
  switchMapTo,
  withLatestFrom
} from 'rxjs/operators';

const LEARNING_AREA = 'learningArea';
const YEAR = 'years';
const METHOD = 'methods';
const TOC = 'eduContentTOC';
const BOOK = 'eduContentTOC.tree';

@Injectable({
  providedIn: 'root'
})
export class TocFilterFactory implements SearchFilterFactory {
  private outputFilters: {
    component: Type<SearchFilterComponentInterface>;
    domHost: string;
  }[] = [
    { component: ColumnFilterComponent, domHost: 'hostLeft' },
    { component: BreadcrumbFilterComponent, domHost: 'hostBreadCrumbs' }
  ];

  // input from viewmodel
  // base for all other streams
  private searchState$ = new BehaviorSubject<SearchStateInterface>(null);

  // keeps track of differences between inputs
  private searchStateDiff$: Observable<
    [SearchStateInterface, SearchStateInterface]
  >;

  // stores the available books of a learningArea
  private booksWithYears$: Observable<EduContentBookInterface[]>;

  // stores the table of contents for the latest selected book
  private treeForBook$: Observable<EduContentTOCInterface[]>;

  constructor(
    private store: Store<DalState>,
    @Inject(TOC_SERVICE_TOKEN) private tocService: TocServiceInterface
  ) {
    this.setupStreams();
  }

  public getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    this.searchState$.next(searchState);

    return combineLatest([
      this.getYearFilterCriteria$(),
      this.getMethodFilterCriteria$(),
      this.getBookFilterCriteria$(),
      this.getTreeFilterCriteria$()
    ]).pipe(
      map(
        ([
          yearFilterCriterium,
          methodFilterCriterium,
          bookFilterCriterium,
          treeFilterCriteria // is an array
        ]) => {
          // combine values
          const filterCriteriaArray = [
            yearFilterCriterium,
            methodFilterCriterium,
            bookFilterCriterium,
            ...treeFilterCriteria
          ]
            // filter out null values
            .filter(value => !!value);

          // make filter
          // interface expects array
          return this.outputFilters.map(outputFilter =>
            this.getFilter(
              filterCriteriaArray,
              outputFilter.component,
              outputFilter.domHost
            )
          );
        }
      )
    );
  }

  public getPredictionFilterNames(searchState: SearchStateInterface): string[] {
    const neededFilterNames: string[] = [];
    if (this.hasSearchStateData(searchState, LEARNING_AREA)) {
      neededFilterNames.push(YEAR);
    }
    if (this.hasSearchStateData(searchState, YEAR)) {
      neededFilterNames.push(METHOD);
    }
    if (this.hasSearchStateData(searchState, METHOD)) {
      neededFilterNames.push(BOOK);
    }
    if (this.hasSearchStateData(searchState, BOOK)) {
      neededFilterNames.push(TOC);
    }
    return neededFilterNames;
  }

  private setupStreams() {
    this.searchStateDiff$ = this.searchState$.pipe(
      startWith(null),
      pairwise(),
      shareReplay(1)
    );

    this.booksWithYears$ = this.searchStateDiff$.pipe(
      filter(searchStateDiff =>
        this.hasSearchStateChanged(searchStateDiff, LEARNING_AREA)
      ),
      switchMap(([oldSearchstate, newSearchstate]) =>
        this.getBooksWithYears(newSearchstate)
      ),
      shareReplay(1)
    );

    this.treeForBook$ = this.searchStateDiff$.pipe(
      filter(
        searchStateDiff =>
          this.hasSearchStateData(searchStateDiff[1], BOOK) &&
          this.hasSearchStateChanged(searchStateDiff, BOOK)
      ),
      map(
        ([, newSearchstate]) =>
          newSearchstate.filterCriteriaSelections.get(BOOK)[0] as number
      ),
      switchMap(neededBookId => {
        return this.tocService.getTree(neededBookId);
      }),
      shareReplay(1)
    );
  }

  /**
   * Returns the filterCriterium for the learningAreas
   *
   * @private
   * @returns {Observable<SearchFilterCriteriaInterface>}
   * @memberof TocFilterFactory
   */
  private getLearningAreaFilterCriteria$(): Observable<
    SearchFilterCriteriaInterface
  > {
    return this.searchState$.pipe(
      switchMapTo(
        this.store.pipe(
          select(LearningAreaQueries.getAll),
          map(areas =>
            this.getFilterCriterium(
              areas,
              LEARNING_AREA,
              'Leergebieden',
              'id',
              'name'
            )
          )
        )
      )
    );
  }

  /**
   * returns array of books from the Api
   * uses learningAreaId from the searchState selections
   *
   * @private
   * @param {SearchStateInterface} searchState
   * @returns {Observable<EduContentBookInterface[]>}
   * @memberof TocFilterFactory
   */
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

  /**
   * Returns the filterCriterium for the years,
   * or null when there isn't enough data
   *
   * @private
   * @returns {Observable<SearchFilterCriteriaInterface>}
   * @memberof TocFilterFactory
   */
  private getYearFilterCriteria$(): Observable<SearchFilterCriteriaInterface> {
    const yearFilterCriteria$ = this.searchState$.pipe(
      filter(searchState =>
        this.hasSearchStateData(searchState, LEARNING_AREA)
      ),
      switchMapTo(this.booksWithYears$),
      map(books => {
        // reduce to array of unique years
        const years: YearInterface[] = books
          .reduce((acc: YearInterface[], book) => {
            book.years.forEach(bookYear => {
              if (!acc.some(year => year.id === bookYear.id)) {
                acc.push(bookYear);
              }
            });
            return acc;
          }, [])
          .sort((a, b) => (a.name < b.name ? -1 : 1));

        return this.getFilterCriterium(years, YEAR, 'Jaren', 'id', 'name');
      })
    );

    const emptyYearFilterCriteria$ = this.searchState$.pipe(
      filter(
        searchState => !this.hasSearchStateData(searchState, LEARNING_AREA)
      ),
      mapTo(null)
    );

    return merge(yearFilterCriteria$, emptyYearFilterCriteria$);
  }

  /**
   * Returns the filterCriterium for the methods,
   * or null when there isn't enough data
   *
   * @private
   * @returns {Observable<SearchFilterCriteriaInterface>}
   * @memberof TocFilterFactory
   */
  private getMethodFilterCriteria$(): Observable<
    SearchFilterCriteriaInterface
  > {
    const methodFilterCriteria$ = this.searchState$.pipe(
      filter(
        searchState =>
          this.hasSearchStateData(searchState, LEARNING_AREA) &&
          this.hasSearchStateData(searchState, YEAR)
      ),
      withLatestFrom(this.booksWithYears$),
      switchMap(([searchState, books]) => {
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

            return this.getFilterCriterium(
              filteredMethods,
              METHOD,
              'Methodes',
              'id',
              'name'
            );
          })
        );
      })
    );

    const emptyMethodFilterCriteria$ = this.searchState$.pipe(
      filter(
        searchState =>
          !(
            this.hasSearchStateData(searchState, LEARNING_AREA) &&
            this.hasSearchStateData(searchState, YEAR)
          )
      ),
      mapTo(null)
    );

    return merge(methodFilterCriteria$, emptyMethodFilterCriteria$);
  }

  /**
   * Returns the filterCriterium for the books,
   * or null when there isn't enough data
   *
   * @private
   * @returns {Observable<SearchFilterCriteriaInterface>}
   * @memberof TocFilterFactory
   */
  private getBookFilterCriteria$(): Observable<SearchFilterCriteriaInterface> {
    const bookFilterCriteria$ = this.searchStateDiff$.pipe(
      filter(
        searchStateDiff =>
          this.hasSearchStateData(searchStateDiff[1], YEAR) &&
          this.hasSearchStateData(searchStateDiff[1], METHOD)
      ),
      withLatestFrom(this.booksWithYears$),
      map(([[oldSearchstate, newSearchstate], books]) => {
        const selectedYearId = newSearchstate.filterCriteriaSelections.get(
          YEAR
        )[0] as number;
        const selectedMethodId = newSearchstate.filterCriteriaSelections.get(
          METHOD
        )[0] as number;

        const filteredBooks = books.filter(
          book =>
            book.years.some(year => year.id === selectedYearId) &&
            book.methodId === selectedMethodId
        );

        return this.getFilterCriterium(
          filteredBooks,
          BOOK,
          'Boeken',
          'id',
          'title'
        );
      })
    );

    const emptyBookFilterCriteria$ = this.searchStateDiff$.pipe(
      filter(
        searchStateDiff =>
          !(
            this.hasSearchStateData(searchStateDiff[1], YEAR) &&
            this.hasSearchStateData(searchStateDiff[1], METHOD)
          )
      ),
      mapTo(null)
    );

    return merge(bookFilterCriteria$, emptyBookFilterCriteria$);
  }

  /**
   * Returns the filterCriteria for the tree,
   * or null when there isn't enough data
   *
   * @private
   * @returns {Observable<SearchFilterCriteriaInterface[]>}
   * @memberof TocFilterFactory
   */
  private getTreeFilterCriteria$(): Observable<
    SearchFilterCriteriaInterface[]
  > {
    const treeFilterCriteria$ = combineLatest(
      this.searchStateDiff$.pipe(
        filter(searchStateDiff =>
          this.hasSearchStateData(searchStateDiff[1], BOOK)
        )
      ),
      this.treeForBook$
    ).pipe(
      map(([[, newSearchstate], tree]) => {
        const treeMap = this.getTreeMap(tree);

        if (!treeMap) return;

        // filter for top level of tree
        const filterForTree = this.getFilterCriterium(
          treeMap.get(0),
          TOC,
          'Inhoudstafel',
          'id',
          'title'
        );

        let filtersForBranches = [];
        if (this.hasSearchStateData(newSearchstate, TOC)) {
          const selectedTocIds = newSearchstate.filterCriteriaSelections.get(
            TOC
          ) as number[];

          // multiple selected tocLevels are possible
          // get last one
          const selectedTocId = selectedTocIds[selectedTocIds.length - 1];

          const tocs = treeMap.get(selectedTocId) || [];

          // filter for branches
          // this creates the filter for the level after the current branch
          filtersForBranches = tocs.reduce((acc, toc) => {
            if (toc.children && toc.children.length) {
              acc.push(
                this.getFilterCriterium(
                  toc.children,
                  TOC,
                  'Inhoudstafel',
                  'id',
                  'title'
                )
              );
            }
            return acc;
          }, []);
        }

        return [filterForTree, ...filtersForBranches];
      })
    );

    const emptyTreeFilterCriteria$ = this.searchStateDiff$.pipe(
      filter(
        searchStateDiff => !this.hasSearchStateData(searchStateDiff[1], BOOK)
      ),
      mapTo(null)
    );

    return merge(treeFilterCriteria$, emptyTreeFilterCriteria$);
  }

  /**
   * Wraps entities in a searchFilterCriterium
   *
   * @private
   * @template T
   * @param {T[]} entities
   * @param {string} entityName
   * @param {string} entityLabel
   * @param {PrimitivePropertiesKeys<T>} entityKeyProperty
   * @param {PrimitivePropertiesKeys<T>} entityDisplayProperty
   * @returns {SearchFilterCriteriaInterface}
   * @memberof TocFilterFactory
   */
  private getFilterCriterium<T>(
    entities: T[],
    entityName: string,
    entityLabel: string,
    entityKeyProperty: PrimitivePropertiesKeys<T>,
    entityDisplayProperty: PrimitivePropertiesKeys<T>
  ): SearchFilterCriteriaInterface {
    if (!entities || !entities.length) return;
    return {
      name: entityName,
      label: entityLabel,
      keyProperty: entityKeyProperty as string,
      displayProperty: entityDisplayProperty as string,
      values: entities.map(entity => ({
        data: entity,
        hasChild: !(
          entity.hasOwnProperty('treeId') && // only if eduContentTOC check for children
          (entity['children'] === undefined || entity['children'].length === 0)
        ) // otherwise default true
      }))
    };
  }

  /**
   * Wraps filterCriteria in a searchFilter
   *
   * @private
   * @param {SearchFilterCriteriaInterface[]} criteria
   * @param {Type<SearchFilterComponentInterface>} component
   * @param {string} domHost
   * @param {*} [options]
   * @returns {SearchFilterInterface}
   * @memberof TocFilterFactory
   */
  private getFilter(
    criteria: SearchFilterCriteriaInterface[],
    component: Type<SearchFilterComponentInterface>,
    domHost: string,
    options?: any
  ): SearchFilterInterface {
    if (!criteria || !criteria.length) return;

    return {
      criteria,
      component,
      domHost,
      options
    };
  }

  /**
   * Returns a map of all branches in the tree
   * Every key (id) maps to the path towards the Toc,
   * including the Toc as a last value
   * key 0 maps the top level of the tree
   *
   * @private
   * @param {EduContentTOCInterface[]} tree
   * @param {Map<number, EduContentTOCInterface[]>} [treeMap=new Map()]
   * @param {EduContentTOCInterface[]} [parentBranches=[]]
   * @returns {Map<number, EduContentTOCInterface[]>}
   * @memberof TocFilterFactory
   *
   * @example  (with ids for brevity, actual map values contain references):
   * tree:
   * 1
   * - 2
   * - - 5
   * - 3
   * 4
   * Map { 0 => [ 1, 4 ], 1 => [1], 2 => [ 1, 2 ], 5 => [ 1, 2, 5 ], 3 => [ 1, 3 ], 4 => [4] }
   * the values in the arrays are the branches, top to bottom
   * id = 0 is original tree
   */
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

  /**
   * Returns if the new searchState selection differs enough from the previous value
   * to warrant an update of values from the Api
   *
   * @private
   * @param {[
   *       SearchStateInterface,
   *       SearchStateInterface
   *     ]} [oldSearchState, newSearchState]
   * @param {string} selectionKey
   * @returns {boolean}
   * @memberof TocFilterFactory
   */
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

  /**
   * Return if the searchState contains a certain selection
   *
   * @private
   * @param {SearchStateInterface} searchState
   * @param {string} selectionKey
   * @returns {boolean}
   * @memberof TocFilterFactory
   */
  private hasSearchStateData(
    searchState: SearchStateInterface,
    selectionKey: string
  ): boolean {
    // only these keys have an implementation that supports multiple selected values
    const selectionKeysThatCanContainMultipleValues = ['eduContentTOC'];

    return (
      searchState.filterCriteriaSelections.has(selectionKey) &&
      // only certain keys can contain multiple values
      ((selectionKeysThatCanContainMultipleValues.includes(selectionKey) &&
        searchState.filterCriteriaSelections.get(selectionKey).length > 0) ||
        // by default, only a single value can be selected
        (!selectionKeysThatCanContainMultipleValues.includes(selectionKey) &&
          searchState.filterCriteriaSelections.get(selectionKey).length === 1))
    );
  }
}
