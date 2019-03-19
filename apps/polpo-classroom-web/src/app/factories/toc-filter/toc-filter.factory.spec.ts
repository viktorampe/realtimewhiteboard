import { async, TestBed } from '@angular/core/testing';
import {
  DalState,
  EduContentBookFixture,
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
  ColumnFilterComponent,
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

  const mockLearningAreas = [
    new LearningAreaFixture({ id: 1 }),
    new LearningAreaFixture({ id: 2 })
  ];

  const mockYears = [new YearFixture({ id: 3 }), new YearFixture({ id: 4 })];

  const mockMethods = [
    new MethodFixture({ id: 5 }),
    new MethodFixture({ id: 6 }),
    new MethodFixture({ id: 7 })
  ];

  const mockBook = new EduContentBookFixture({ id: 8, title: 'Shuffle 5' });

  const mockTree: EduContentTOCInterface[] = [
    new EduContentTOCFixture({
      treeId: 1,
      id: 1,
      eduContentBook: mockBook,
      title: "Unit 2 - I'm not an addict",
      depth: 0,
      lft: 1,
      rgt: 6,
      children: [
        new EduContentTOCFixture({
          treeId: 1,
          id: 2,
          eduContentBook: mockBook,
          title: 'Focus on',
          depth: 1,
          lft: 2,
          rgt: 3
        }),
        new EduContentTOCFixture({
          treeId: 1,
          id: 3,
          eduContentBook: mockBook,
          title: 'I am the pope of dope',
          depth: 1,
          lft: 4,
          rgt: 5
        })
      ]
    }),
    new EduContentTOCFixture({
      treeId: 1,
      id: 4,
      eduContentBook: mockBook,
      title: 'Unit 3 - Believe',
      depth: 0,
      lft: 7,
      rgt: 8
    })
  ];

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
        Store,
        {
          provide: TOC_SERVICE_TOKEN,
          useValue: {
            getBooksByYearAndMethods: () => of([mockBook]),
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
    let expected: SearchFilterInterface[];
    let result: Observable<SearchFilterInterface[]>;

    const mockSearchState: SearchStateInterface = {
      searchTerm: '',
      filterCriteriaSelections: new Map<string, (number | string)[]>()
    };

    const mockSelectedAreaId = 1;
    const mockSelectedYearId = 4;
    const mockSelectedMethodId = 6;
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
        mockSearchState.filterCriteriaSelections.clear();
        mockSearchState.filterCriteriaSelections.set('LearningArea', [
          mockSelectedAreaId
        ]);

        result = factory.getFilters(mockSearchState);
      });

      describe('last selection: learningArea', () => {
        it('should return filterCriteria', () => {
          const expectedLearningAreaFilter = getExpectedLearningAreaFilter(
            mockSelectedAreaId
          );
          const expectedYearFilter = getExpectedYearFilter();

          expected = [expectedLearningAreaFilter, expectedYearFilter];

          expect(result).toBeObservable(cold('a', { a: expected }));
        });
      });
    });

    describe('years', () => {
      beforeEach(() => {
        mockSearchState.filterCriteriaSelections.clear();
        mockSearchState.filterCriteriaSelections.set('LearningArea', [
          mockSelectedAreaId
        ]);
        mockSearchState.filterCriteriaSelections.set('Year', [
          mockSelectedYearId
        ]);

        result = factory.getFilters(mockSearchState);
      });

      describe('last selection: year', () => {
        it('should return filterCriteria', () => {
          const expectedLearningAreaFilter = getExpectedLearningAreaFilter(
            mockSelectedAreaId
          );
          const expectedYearFilter = getExpectedYearFilter(mockSelectedYearId);
          const expectedMethodFilter = getExpectedMethodFilter();

          expected = [
            expectedLearningAreaFilter,
            expectedYearFilter,
            expectedMethodFilter
          ];

          expect(result).toBeObservable(cold('a', { a: expected }));
        });
      });
    });

    describe('methods', () => {
      beforeEach(() => {
        mockSearchState.filterCriteriaSelections.clear();
        mockSearchState.filterCriteriaSelections.set('LearningArea', [
          mockSelectedAreaId
        ]);
        mockSearchState.filterCriteriaSelections.set('Year', [
          mockSelectedYearId
        ]);
        mockSearchState.filterCriteriaSelections.set('Method', [
          mockSelectedMethodId
        ]);

        result = factory.getFilters(mockSearchState);
      });

      describe('last selection: method', () => {
        it('should return filterCriteria', () => {
          const expectedLearningAreaFilter = getExpectedLearningAreaFilter(
            mockSelectedAreaId
          );
          const expectedYearFilter = getExpectedYearFilter(mockSelectedYearId);

          const expectedMethodFilter = getExpectedMethodFilter(
            mockSelectedMethodId
          );
          const expectedTreeFilter = getExpectedTreeFilter();

          expected = [
            expectedLearningAreaFilter,
            expectedYearFilter,
            expectedMethodFilter,
            expectedTreeFilter
          ];

          expect(result).toBeObservable(cold('a', { a: expected }));
        });

        it('should cache the TOC from the service', async(() => {
          const cachedTree = factory['cachedTree'];
          expect(cachedTree.toc).toBeObservable(hot('a', { a: mockTree }));
        }));
      });
    });

    describe('TOC tree', () => {
      beforeEach(() => {
        mockSearchState.filterCriteriaSelections.clear();
        mockSearchState.filterCriteriaSelections.set('LearningArea', [
          mockSelectedAreaId
        ]);
        mockSearchState.filterCriteriaSelections.set('Year', [
          mockSelectedYearId
        ]);
        mockSearchState.filterCriteriaSelections.set('Method', [
          mockSelectedMethodId
        ]);
        mockSearchState.filterCriteriaSelections.set('EduContentTOC_0', [
          mockSelectedTocId
        ]);

        result = factory.getFilters(mockSearchState);
      });

      it('should return filterCriteria', () => {
        const expectedLearningAreaFilter = getExpectedLearningAreaFilter(
          mockSelectedAreaId
        );
        const expectedYearFilter = getExpectedYearFilter(mockSelectedYearId);

        const expectedMethodFilter = getExpectedMethodFilter(
          mockSelectedMethodId
        );
        const expectedTreeFilter = getExpectedTreeFilter([], mockSelectedTocId);
        const expectedTreeFilter_1 = getExpectedTreeFilter([mockSelectedTocId]);

        expected = [
          expectedLearningAreaFilter,
          expectedYearFilter,
          expectedMethodFilter,
          expectedTreeFilter,
          expectedTreeFilter_1
        ];

        expect(result).toBeObservable(cold('a', { a: expected }));
      });

      it("should not return extra filterCriteria if there aren't any children", () => {
        const expectedLearningAreaFilter = getExpectedLearningAreaFilter(
          mockSelectedAreaId
        );
        const expectedYearFilter = getExpectedYearFilter(mockSelectedYearId);

        const expectedMethodFilter = getExpectedMethodFilter(
          mockSelectedMethodId
        );
        const expectedTreeFilter = getExpectedTreeFilter([], mockSelectedTocId);
        const expectedTreeFilter_1 = getExpectedTreeFilter([mockSelectedTocId]);

        // also select second EduContentTOC
        // this doesn't have children
        const mockSelectedTocId_1 = 2;
        mockSearchState.filterCriteriaSelections.set('EduContentTOC_1', [
          mockSelectedTocId_1
        ]);

        expected = [
          expectedLearningAreaFilter,
          expectedYearFilter,
          expectedMethodFilter,
          expectedTreeFilter,
          expectedTreeFilter_1
        ];

        expect(result).toBeObservable(cold('a', { a: expected }));
      });

      describe('update cache', () => {
        // getFilters() has already been called once in the beforeEach

        it('should update the cached Toc - LearningArea', () => {
          // at this point LearningArea 1 is selected

          const newSearchState = { ...mockSearchState };
          newSearchState.filterCriteriaSelections.set('LearningArea', [2]);

          const newTree = mockTree[0];

          tocService.getTree = jest.fn().mockReturnValue(of(newTree));

          factory.getFilters(newSearchState);
          const cachedTree = factory['cachedTree'];
          expect(cachedTree.toc).toBeObservable(hot('a', { a: newTree }));
        });

        it('should update the cached Toc - Year', () => {
          // at this point Year 4 is selected

          const newSearchState = { ...mockSearchState };
          newSearchState.filterCriteriaSelections.set('Year', [5]);

          const newTree = mockTree[0];

          tocService.getTree = jest.fn().mockReturnValue(of(newTree));

          factory.getFilters(newSearchState);
          const cachedTree = factory['cachedTree'];
          expect(cachedTree.toc).toBeObservable(hot('a', { a: newTree }));
        });

        it('should update the cached Toc - Method', () => {
          // at this point Method 6 is selected

          const newSearchState = { ...mockSearchState };
          newSearchState.filterCriteriaSelections.set('Method', [7]);

          const newTree = mockTree[0];

          tocService.getTree = jest.fn().mockReturnValue(of(newTree));

          factory.getFilters(newSearchState);
          const cachedTree = factory['cachedTree'];
          expect(cachedTree.toc).toBeObservable(hot('a', { a: newTree }));
        });
      });

      describe('do not update cache', () => {
        // getFilters() has already been called once in the beforeEach

        beforeEach(() => {
          // manually change cache
          // can't change returnValue of Service, since that triggers update of
        });

        it('should not update the cached Toc', () => {
          // service return different value
          // cached value should not return this
          tocService.getTree = jest.fn().mockReturnValue(of(mockTree[0]));

          const newSearchState = { ...mockSearchState };
          const cachedTree = factory['cachedTree'];

          // no selection
          newSearchState.filterCriteriaSelections.clear();
          factory.getFilters(newSearchState);
          expect(cachedTree.toc).toBeObservable(hot('a', { a: mockTree }));

          // select LearningArea
          newSearchState.filterCriteriaSelections.set('LearningArea', [
            mockSelectedAreaId
          ]);
          factory.getFilters(newSearchState);
          expect(cachedTree.toc).toBeObservable(hot('a', { a: mockTree }));

          // select Year
          newSearchState.filterCriteriaSelections.set('Year', [
            mockSelectedYearId
          ]);
          factory.getFilters(newSearchState);
          expect(cachedTree.toc).toBeObservable(hot('a', { a: mockTree }));

          // select Method
          newSearchState.filterCriteriaSelections.set('Method', [
            mockSelectedMethodId
          ]);
          factory.getFilters(newSearchState);
          expect(cachedTree.toc).toBeObservable(hot('a', { a: mockTree }));

          // select a different Toc
          // Toc 1 was selected
          newSearchState.filterCriteriaSelections.set('EduContentTOC_0', [2]);
          factory.getFilters(newSearchState);
          expect(cachedTree.toc).toBeObservable(hot('a', { a: mockTree }));
        });
      });
    });
  });

  function getExpectedLearningAreaFilter(selectedId?: number) {
    return {
      criteria: {
        name: 'LearningArea',
        label: 'Leergebieden',
        keyProperty: 'id',
        displayProperty: 'name',
        values: mockLearningAreas.map(area => ({
          data: area,
          selected: area.id === selectedId
        }))
      },
      component: ColumnFilterComponent,
      domHost: 'hostLeft',
      options: undefined
    };
  }

  function getExpectedYearFilter(selectedId?: number) {
    return {
      criteria: {
        name: 'Year',
        label: 'Jaren',
        keyProperty: 'id',
        displayProperty: 'name',
        values: mockYears.map(year => ({
          data: year,
          selected: year.id === selectedId
        }))
      },
      component: ColumnFilterComponent,
      domHost: 'hostLeft',
      options: undefined
    };
  }

  function getExpectedMethodFilter(selectedId?: number) {
    return {
      criteria: {
        name: 'Method',
        label: 'Methodes',
        keyProperty: 'id',
        displayProperty: 'name',
        values: mockMethods.map(method => ({
          data: method,
          selected: method.id === selectedId
        }))
      },
      component: ColumnFilterComponent,
      domHost: 'hostLeft',
      options: undefined
    };
  }

  function getExpectedTreeFilter(
    parentIds: number[] = [], // Note: you are expected to pass ids that exist
    selectedId?: number
  ) {
    const depth = parentIds.length;

    let tree = mockTree;
    parentIds.forEach(id => (tree = tree.find(toc => toc.id === id).children));

    // catch toc without children
    if (!tree) return;

    return {
      criteria: {
        name: 'EduContentTOC_' + depth,
        label: 'Inhoudstafel',
        keyProperty: 'id',
        displayProperty: 'title',
        values: tree.map(toc => ({
          data: toc,
          selected: toc.id === selectedId
        }))
      },
      component: ColumnFilterComponent,
      domHost: 'hostLeft',
      options: undefined
    };
  }
});
