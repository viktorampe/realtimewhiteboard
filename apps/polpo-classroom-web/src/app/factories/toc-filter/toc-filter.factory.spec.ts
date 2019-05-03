import { TestBed } from '@angular/core/testing';
import {
  DalState,
  EduContentBookFixture,
  EduContentBookInterface,
  EduContentTOCFixture,
  EduContentTOCInterface,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  MethodActions,
  MethodFixture,
  MethodReducer,
  TocServiceInterface,
  TOC_SERVICE_TOKEN,
  YearActions,
  YearFixture,
  YearReducer
} from '@campus/dal';
import {
  BreadcrumbFilterComponent,
  ColumnFilterComponent,
  SearchFilterCriteriaInterface,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { TocFilterFactory } from './toc-filter.factory';

describe('TocFilterFactory', () => {
  let store: Store<DalState>;
  let tocService: TocServiceInterface;

  const expectedOutputFilters = [
    {
      component: ColumnFilterComponent,
      domHost: 'hostLeft'
    },
    {
      component: BreadcrumbFilterComponent,
      domHost: 'hostBreadCrumbs'
    }
  ];

  const mockLearningAreas = [
    new LearningAreaFixture({ id: 1 }),
    new LearningAreaFixture({ id: 2 })
  ];

  const mockYears = [
    new YearFixture({ id: 3, name: '3' }),
    new YearFixture({ id: 4, name: '4' })
  ];

  const mockMethods = [
    new MethodFixture({ id: 5, learningAreaId: 1 }),
    new MethodFixture({ id: 6, learningAreaId: 1 }),
    new MethodFixture({ id: 7, learningAreaId: 1 })
  ];

  const mockBooks = [
    new EduContentBookFixture({
      id: 7,
      title: 'Shuffle 3',
      methodId: 6,
      years: [mockYears[0]]
    }),
    new EduContentBookFixture({
      id: 8,
      title: 'Shuffle 4',
      methodId: 6,
      years: [mockYears[1]]
    }),
    new EduContentBookFixture({
      id: 5,
      title: 'Shuffle 4 GO',
      methodId: 6,
      years: [mockYears[1]]
    }),
    new EduContentBookFixture({
      id: 9,
      title: 'Not Shuffle 4',
      methodId: 7,
      years: [mockYears[1]]
    })
  ];

  const mockTree: EduContentTOCInterface[] = [
    new EduContentTOCFixture({
      treeId: mockBooks[1].id,
      id: 1,
      eduContentBook: mockBooks[1],
      title: "Unit 2 - I'm not an addict",
      depth: 0,
      lft: 1,
      rgt: 6,
      children: [
        new EduContentTOCFixture({
          treeId: mockBooks[1].id,
          id: 2,
          eduContentBook: mockBooks[1],
          title: 'Focus on',
          depth: 1,
          lft: 2,
          rgt: 3
        }),
        new EduContentTOCFixture({
          treeId: mockBooks[1].id,
          id: 3,
          eduContentBook: mockBooks[1],
          title: 'I am the pope of dope',
          depth: 1,
          lft: 4,
          rgt: 5
        })
      ]
    }),
    new EduContentTOCFixture({
      treeId: mockBooks[1].id,
      id: 4,
      eduContentBook: mockBooks[1],
      title: 'Unit 3 - Believe',
      depth: 0,
      lft: 7,
      rgt: 8
    })
  ];

  const mockTreeMap = new Map<number, EduContentTOCInterface[]>([
    [0, mockTree],
    [1, [mockTree[0]]],
    [2, [mockTree[0], mockTree[0].children[0]]],
    [3, [mockTree[0], mockTree[0].children[1]]],
    [4, [mockTree[1]]]
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          LearningAreaReducer,
          YearReducer,
          MethodReducer
        ])
      ],
      providers: [
        TocFilterFactory,
        Store,
        {
          provide: TOC_SERVICE_TOKEN,
          useValue: {
            getBooksByMethodIds: () => of(mockBooks),
            getTree: () => of(mockTree)
          }
        }
      ]
    });

    store = TestBed.get(Store);
    tocService = TestBed.get(TOC_SERVICE_TOKEN);
  });

  it('should be created', () => {
    const factory: TocFilterFactory = TestBed.get(TocFilterFactory);
    expect(factory).toBeTruthy();
  });

  describe('getfilters', () => {
    let factory: TocFilterFactory;
    let expected: SearchFilterCriteriaInterface[];
    let result: Observable<SearchFilterInterface[]>;

    const mockSelectedAreaId = 1;
    const mockSelectedYearId = 4;
    const mockSelectedMethodId = 6;
    const mockSelectedBookId = 7;
    const mockSelectedTocId = 1;

    beforeEach(() => {
      factory = TestBed.get(TocFilterFactory);

      store.dispatch(
        new LearningAreaActions.LearningAreasLoaded({
          learningAreas: mockLearningAreas
        })
      );

      store.dispatch(
        new YearActions.YearsLoaded({
          years: mockYears
        })
      );

      store.dispatch(
        new MethodActions.MethodsLoaded({
          methods: mockMethods
        })
      );
    });

    describe('learningAreas', () => {
      beforeEach(() => {
        const mockSearchState = getMockSearchState(mockSelectedAreaId);
        result = factory.getFilters(mockSearchState);
      });

      describe('last selection: learningArea', () => {
        it('should return filterCriteria', () => {
          const expectedYearFilter = getExpectedYearFilterCriterium();

          expected = [expectedYearFilter];

          expect(result).toBeObservable(hot('a', { a: getFilter(expected) }));
        });
      });
    });

    describe('years', () => {
      beforeEach(() => {
        const mockSearchState = getMockSearchState(
          mockSelectedAreaId,
          mockSelectedYearId
        );
        result = factory.getFilters(mockSearchState);
      });

      describe('last selection: year', () => {
        it('should return filterCriteria', () => {
          const expectedYearFilter = getExpectedYearFilterCriterium();
          const expectedMethodFilter = getExpectedMethodFilterCriterium([6, 7]);

          expected = [expectedYearFilter, expectedMethodFilter];

          expect(result).toBeObservable(hot('a', { a: getFilter(expected) }));
        });
      });
    });

    describe('methods', () => {
      beforeEach(() => {
        const mockSearchState = getMockSearchState(
          mockSelectedAreaId,
          mockSelectedYearId,
          mockSelectedMethodId
        );
        result = factory.getFilters(mockSearchState);
      });

      describe('last selection: method', () => {
        it('should return filterCriteria', () => {
          const expectedYearFilter = getExpectedYearFilterCriterium();

          const expectedMethodFilter = getExpectedMethodFilterCriterium([6, 7]);
          const expectedBookFilter = getExpectedBookFilterCriteria([8, 5]);

          expected = [
            expectedYearFilter,
            expectedMethodFilter,
            expectedBookFilter
          ];

          expect(result).toBeObservable(cold('a', { a: getFilter(expected) }));
        });
      });
    });

    describe('TOC tree', () => {
      beforeEach(() => {
        const mockSearchState = getMockSearchState(
          mockSelectedAreaId,
          mockSelectedYearId,
          mockSelectedMethodId,
          mockSelectedBookId,
          mockSelectedTocId
        );
        result = factory.getFilters(mockSearchState);
      });

      it('should return toc filterCriteria', () => {
        const expectedYearFilter = getExpectedYearFilterCriterium();
        const expectedMethodFilter = getExpectedMethodFilterCriterium([6, 7]);
        const expectedBookFilter = getExpectedBookFilterCriteria([8, 5]);
        const expectedTreeFilter = getExpectedTreeFilterCriteria();
        const expectedTreeFilter_1 = getExpectedTreeFilterCriteria([1]);

        expected = [
          expectedYearFilter,
          expectedMethodFilter,
          expectedBookFilter,
          expectedTreeFilter,
          expectedTreeFilter_1
        ];

        expect(result).toBeObservable(cold('a', { a: getFilter(expected) }));
      });

      it("should not return extra filterCriteria if there aren't any children", () => {
        const expectedYearFilter = getExpectedYearFilterCriterium();
        const expectedMethodFilter = getExpectedMethodFilterCriterium([6, 7]);
        const expectedBookFilter = getExpectedBookFilterCriteria([8, 5]);
        const expectedTreeFilter = getExpectedTreeFilterCriteria();

        const mockSearchState = getMockSearchState(
          mockSelectedAreaId,
          mockSelectedYearId,
          mockSelectedMethodId,
          mockSelectedBookId,
          mockSelectedTocId
        );
        // also select second EduContentTOC
        // this doesn't have children
        const mockSelectedTocId_1 = 2;
        mockSearchState.filterCriteriaSelections.set('eduContentTOC', [
          mockSelectedTocId_1
        ]);

        const expectedTreeFilter_1 = getExpectedTreeFilterCriteria([
          mockSelectedTocId
        ]);

        expected = [
          expectedYearFilter,
          expectedMethodFilter,
          expectedBookFilter,
          expectedTreeFilter,
          expectedTreeFilter_1
        ];
        result = factory.getFilters(mockSearchState);
        expect(result).toBeObservable(cold('a', { a: getFilter(expected) }));
      });

      describe('update cache', () => {
        it('should update the cached Toc - LearningArea', () => {
          // at this point LearningArea 1 is selected

          const newSearchState = getMockSearchState(
            2,
            mockSelectedYearId,
            mockSelectedMethodId,
            mockSelectedBookId,
            mockSelectedTocId
          );

          const newTree = [mockTree[0]];
          tocService.getTree = jest.fn().mockReturnValue(of(newTree));

          result = factory.getFilters(newSearchState);
          result.subscribe();

          expect(tocService.getTree).toHaveBeenCalled();
        });

        it('should update the cached Toc - Year', () => {
          // at this point Year 4 is selected

          const newSearchState = getMockSearchState(
            mockSelectedAreaId,
            3,
            mockSelectedMethodId,
            mockSelectedBookId,
            mockSelectedTocId
          );

          const newTree = [mockTree[0]];
          tocService.getTree = jest.fn().mockReturnValue(of(newTree));

          result = factory.getFilters(newSearchState);
          result.subscribe();

          expect(tocService.getTree).toHaveBeenCalled();
        });

        it('should update the cached Toc - Method', () => {
          // at this point Method 6 is selected

          const newSearchState = getMockSearchState(
            mockSelectedAreaId,
            mockSelectedYearId,
            7,
            mockSelectedBookId,
            mockSelectedTocId
          );

          const newTree = [mockTree[0]];
          tocService.getTree = jest.fn().mockReturnValue(of(newTree));

          result = factory.getFilters(newSearchState);
          result.subscribe();

          expect(tocService.getTree).toHaveBeenCalled();
        });
      });

      describe('do not update cache', () => {
        // getFilters() has already been called once in the beforeEach

        it('should not update the cached Toc', () => {
          // not subscribing in expects
          // subscribong manually
          result.subscribe();

          // service return different value
          // cached value should not return this
          tocService.getTree = jest.fn().mockReturnValue(of(mockTree[0]));

          const newSearchState = getMockSearchState(
            mockSelectedAreaId,
            mockSelectedYearId,
            mockSelectedMethodId,
            mockSelectedBookId,
            mockSelectedTocId
          );

          // no selection
          newSearchState.filterCriteriaSelections.clear();
          result = factory.getFilters(newSearchState);

          expect(tocService.getTree).not.toHaveBeenCalled();

          // select LearningArea
          newSearchState.filterCriteriaSelections.set('learningArea', [
            mockSelectedAreaId
          ]);
          result = factory.getFilters(newSearchState);

          expect(tocService.getTree).not.toHaveBeenCalled();

          // select Year
          newSearchState.filterCriteriaSelections.set('year', [
            mockSelectedYearId
          ]);
          result = factory.getFilters(newSearchState);

          expect(tocService.getTree).not.toHaveBeenCalled();

          // select Method
          newSearchState.filterCriteriaSelections.set('method', [
            mockSelectedMethodId
          ]);
          result = factory.getFilters(newSearchState);

          expect(tocService.getTree).not.toHaveBeenCalled();

          // select a different Toc
          // Toc 1 was selected
          newSearchState.filterCriteriaSelections.set('eduContentTOC', [2]);
          result = factory.getFilters(newSearchState);

          expect(tocService.getTree).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('getPredictionFilterNames', () => {
    it('should return the filternames', () => {
      const factory: TocFilterFactory = TestBed.get(TocFilterFactory);

      // learningarea present
      let mockSearchState = getMockSearchState(1);
      let result = factory.getPredictionFilterNames(mockSearchState);
      expect(result).toEqual(['years']);

      // learningarea, years present
      mockSearchState = getMockSearchState(1, 1);
      result = factory.getPredictionFilterNames(mockSearchState);
      expect(result).toEqual(['years', 'methods']);

      // learningarea, years, methods present
      mockSearchState = getMockSearchState(1, 1, 1);
      result = factory.getPredictionFilterNames(mockSearchState);
      expect(result).toEqual(['years', 'methods', 'eduContentTOC.tree']);

      // learningarea, years, methods, book present
      mockSearchState = getMockSearchState(1, 1, 1, 1);
      result = factory.getPredictionFilterNames(mockSearchState);
      expect(result).toEqual([
        'years',
        'methods',
        'eduContentTOC.tree',
        'eduContentTOC'
      ]);

      // learningarea, years, methods, book, toc present -> same as last
      mockSearchState = getMockSearchState(1, 1, 1, 1, 1);
      result = factory.getPredictionFilterNames(mockSearchState);
      expect(result).toEqual([
        'years',
        'methods',
        'eduContentTOC.tree',
        'eduContentTOC'
      ]);
    });
  });

  function getFilter(criteria) {
    return expectedOutputFilters.map(outputFilter => ({
      criteria,
      component: outputFilter.component,
      domHost: outputFilter.domHost,
      options: undefined
    }));
  }

  function getExpectedLearningAreaFilterCriterium() {
    return {
      name: 'learningArea',
      label: 'Leergebieden',
      keyProperty: 'id',
      displayProperty: 'name',
      values: mockLearningAreas.map(area => ({
        data: area,
        hasChild: true
      }))
    };
  }

  function getExpectedYearFilterCriterium() {
    return {
      name: 'years',
      label: 'Jaren',
      keyProperty: 'id',
      displayProperty: 'label',
      values: mockYears.map(year => ({
        data: year,
        hasChild: true
      }))
    };
  }

  function getExpectedMethodFilterCriterium(methodIds?: number[]) {
    return {
      name: 'methods',
      label: 'Methodes',
      keyProperty: 'id',
      displayProperty: 'name',
      values: mockMethods
        .filter(method => methodIds.includes(method.id))
        .map(method => ({
          data: method,
          hasChild: true
        }))
    };
  }

  function getExpectedBookFilterCriteria(expectedBooksIds: number[]) {
    let expectedBooks: EduContentBookInterface[];
    if (!expectedBooksIds) {
      expectedBooks = mockBooks;
    } else {
      expectedBooks = mockBooks.filter(book =>
        expectedBooksIds.includes(book.id)
      );
    }

    return {
      name: 'eduContentTOC.tree',
      label: 'Boeken',
      keyProperty: 'id',
      displayProperty: 'title',
      values: expectedBooks.map(book => ({
        data: book,
        hasChild: true
      }))
    };
  }

  /**
   * This function walks the mocking tree and returns a filter
   * with the children for the deepest toc it can find from the parent ids
   * @param parentIds parentIds in anchestor to child order
   */
  function getExpectedTreeFilterCriteria(
    parentIds: number[] = [] // Note: you are expected to pass ids that exist
  ) {
    const depth = parentIds.length;

    let tree = mockTree;
    parentIds.forEach(id => (tree = tree.find(toc => toc.id === id).children));

    // catch toc without children
    if (!tree) return;

    return {
      name: 'eduContentTOC',
      label: 'Inhoudstafel',
      keyProperty: 'id',
      displayProperty: 'title',
      values: tree.map(toc => ({
        data: toc,
        hasChild: toc.children !== undefined && !!toc.children.length
      }))
    };
  }

  function getMockSearchState(
    areaId?: number,
    yearId?: number,
    methodId?: number,
    bookId?: number,
    tocId?: number
  ): SearchStateInterface {
    const newSearchState = {
      searchTerm: '',
      filterCriteriaSelections: new Map<string, (number | string)[]>()
    };
    if (areaId)
      newSearchState.filterCriteriaSelections.set('learningArea', [areaId]);

    if (yearId) newSearchState.filterCriteriaSelections.set('years', [yearId]);

    if (methodId)
      newSearchState.filterCriteriaSelections.set('methods', [methodId]);
    if (bookId)
      newSearchState.filterCriteriaSelections.set('eduContentTOC.tree', [
        bookId
      ]);

    if (tocId)
      newSearchState.filterCriteriaSelections.set('eduContentTOC', [tocId]);

    return newSearchState;
  }
});
