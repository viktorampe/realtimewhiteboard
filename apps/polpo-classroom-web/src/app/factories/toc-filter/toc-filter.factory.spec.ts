import { TestBed } from '@angular/core/testing';
import {
  DalState,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  MethodActions,
  MethodFixture,
  MethodReducer,
  TOC_SERVICE_TOKEN,
  YearActions,
  YearFixture,
  YearReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { SearchFilterInterface, SearchStateInterface } from '../../interfaces';
import { EduContentBookFixture } from './../../../../../dal/src/lib/+fixtures/EduContentBook.fixture';
import { ColumnFilterComponent } from './../../components/column-filter/column-filter.component';
import { TocFilterFactory } from './toc-filter.factory';

describe('TocFilterFactory', () => {
  let store: Store<DalState>;

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

  const mockBook = new EduContentBookFixture({ id: 8 });

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
          useValue: { getBooksByYearAndMethods: () => of([mockBook]) }
        }
      ]
    });

    store = TestBed.get(Store);
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

      result = factory.getFilters(mockSearchState);
    });

    describe('learningAreas', () => {
      const mockSelectedAreaId = 1;
      const expectedLearningAreaFilter = getExpectedLearningAreaFilter(
        mockSelectedAreaId
      );

      beforeAll(() => {
        // select learningArea
        mockSearchState.filterCriteriaSelections.set('LearningArea', [
          mockSelectedAreaId
        ]);
      });

      describe('last selection: learningArea', () => {
        it('should return filterCriteria', () => {
          const expectedYearFilter = getExpectedYearFilter();

          expected = [expectedLearningAreaFilter, expectedYearFilter];

          expect(result).toBeObservable(cold('a', { a: expected }));
        });
      });

      describe('years', () => {
        const mockSelectedYearId = 4;
        const expectedYearFilter = getExpectedYearFilter(mockSelectedYearId);

        beforeAll(() => {
          // also select year
          mockSearchState.filterCriteriaSelections.set('Year', [
            mockSelectedYearId
          ]);
        });

        describe('last selection: year', () => {
          it('should return filterCriteria', () => {
            const expectedMethodFilter = getExpectedMethodFilter();

            expected = [
              expectedLearningAreaFilter,
              expectedYearFilter,
              expectedMethodFilter
            ];

            expect(result).toBeObservable(cold('a', { a: expected }));
          });
        });

        describe('methods', () => {
          const mockSelectedMethodId = 6;
          const expectedMethodFilter = getExpectedMethodFilter(
            mockSelectedMethodId
          );

          beforeAll(() => {
            // also select method
            mockSearchState.filterCriteriaSelections.set('Method', [
              mockSelectedMethodId
            ]);
          });

          describe('last selection: method', () => {
            it('should return filterCriteria', () => {
              expected = [
                expectedLearningAreaFilter,
                expectedYearFilter,
                expectedMethodFilter
              ];

              expect(result).toBeObservable(cold('a', { a: expected }));
            });
          });

          describe('TOC tree', () => {});
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
});
