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
import { Observable } from 'rxjs';
import { SearchFilterInterface, SearchStateInterface } from '../../interfaces';
import { ColumnFilterComponent } from './../../components/column-filter/column-filter.component';
import { TocFilterFactory } from './toc-filter.factory';

describe('TocFilterFactory', () => {
  let store: Store<DalState>;

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
      providers: [Store, { provide: TOC_SERVICE_TOKEN, useValue: {} }]
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
    });

    describe('learningAreas', () => {
      const mockLearningAreas = [
        new LearningAreaFixture({ id: 1 }),
        new LearningAreaFixture({ id: 2 })
      ];

      const expectedLearningAreaFilter = {
        criteria: {
          name: 'LearningArea',
          label: 'Leergebieden',
          keyProperty: 'id',
          displayProperty: 'name',
          values: [
            {
              data: mockLearningAreas[0],
              selected: true
            },
            {
              data: mockLearningAreas[1],
              selected: false
            }
          ]
        },
        component: ColumnFilterComponent,
        domHost: 'hostLeft',
        options: undefined
      };

      beforeAll(() => {
        // select learningArea with id:1
        mockSearchState.filterCriteriaSelections.set('LearningArea', [1]);
      });

      beforeEach(() => {
        store.dispatch(
          new LearningAreaActions.LearningAreasLoaded({
            learningAreas: mockLearningAreas
          })
        );

        result = factory.getFilters(mockSearchState);
      });

      describe('last selection: learningArea', () => {
        it('should return filterCriteria', () => {
          expected = [expectedLearningAreaFilter];

          expect(result).toBeObservable(cold('a', { a: expected }));
        });
      });

      describe('years', () => {
        const mockYears = [
          new YearFixture({ id: 3 }),
          new YearFixture({ id: 4 })
        ];

        const expectedYearFilter: SearchFilterInterface = {
          criteria: {
            name: 'Year',
            label: 'Jaren',
            keyProperty: 'id',
            displayProperty: 'name',
            values: [
              {
                data: mockYears[0],
                selected: false
              },
              {
                data: mockYears[1],
                selected: true
              }
            ]
          },
          component: ColumnFilterComponent,
          domHost: 'hostLeft',
          options: undefined
        };

        beforeAll(() => {
          // also select year with id:4
          mockSearchState.filterCriteriaSelections.set('Year', [4]);
        });

        beforeEach(() => {
          store.dispatch(
            new YearActions.YearsLoaded({
              years: mockYears
            })
          );
        });

        describe('last selection: year', () => {
          it('should return filterCriteria', () => {
            expected = [expectedLearningAreaFilter, expectedYearFilter];

            expect(result).toBeObservable(cold('a', { a: expected }));
          });
        });

        describe('methods', () => {
          const mockMethods = [
            new MethodFixture({ id: 5 }),
            new MethodFixture({ id: 6 }),
            new MethodFixture({ id: 7 })
          ];

          const expectedMethodFilter: SearchFilterInterface = {
            criteria: {
              name: 'Method',
              label: 'Methodes',
              keyProperty: 'id',
              displayProperty: 'name',
              values: [
                {
                  data: mockMethods[0],
                  selected: false
                },
                {
                  data: mockMethods[1],
                  selected: true
                },
                {
                  data: mockMethods[2],
                  selected: false
                }
              ]
            },
            component: ColumnFilterComponent,
            domHost: 'hostLeft',
            options: undefined
          };

          beforeAll(() => {
            // also select method with id:6
            mockSearchState.filterCriteriaSelections.set('Method', [6]);
          });

          beforeEach(() => {
            store.dispatch(
              new MethodActions.MethodsLoaded({
                methods: mockMethods
              })
            );
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
        });
      });
    });
  });
});
