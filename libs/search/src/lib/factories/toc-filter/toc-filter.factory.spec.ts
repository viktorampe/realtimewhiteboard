import { TestBed } from '@angular/core/testing';
import {
  DalState,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer,
  TOC_SERVICE_TOKEN,
  YearActions,
  YearReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { SearchStateInterface } from '../../interfaces';
import { ColumnFilterComponent } from './../../components/column-filter/column-filter.component';
import { TocFilterFactory } from './toc-filter.factory';

describe('TocFilterFactory', () => {
  let store: Store<DalState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([LearningAreaReducer, YearReducer])
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

    const mockLearningAreas = [
      new LearningAreaFixture({ id: 1 }),
      new LearningAreaFixture({ id: 2 })
    ];

    const mockSearchState: SearchStateInterface = {
      searchTerm: '',
      filterCriteriaSelections: new Map<string, (number | string)[]>()
    };

    beforeEach(() => {
      store.dispatch(
        new LearningAreaActions.LearningAreasLoaded({
          learningAreas: mockLearningAreas
        })
      );

      factory = TestBed.get(TocFilterFactory);
    });

    describe('learningAreas', () => {
      beforeAll(() => {
        // select learningArea with id:1
        mockSearchState.filterCriteriaSelections.set('LearningArea', [1]);
      });

      describe('last selection: learningArea', () => {
        it('should return filterCriteria', () => {
          const result = factory.getFilters(mockSearchState);

          const expected = [
            {
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
            }
          ];

          expect(result).toBeObservable(cold('a', { a: expected }));
        });
      });

      describe('years', () => {
        const mockYears = [];

        beforeAll(() => {
          // also select year with id:2
          mockSearchState.filterCriteriaSelections.set('Year', [2]);
        });

        beforeEach(() => {
          store.dispatch(
            new YearActions.YearsLoaded({
              years: mockYears
            })
          );

          factory = TestBed.get(TocFilterFactory);
        });

        describe('last selection: year', () => {});
      });
    });
  });
});
