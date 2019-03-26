import { TestBed } from '@angular/core/testing';
import {
  DalState,
  EDU_CONTENT_SERVICE_TOKEN,
  FavoriteActions,
  FavoriteFixture,
  FavoriteReducer,
  FavoriteTypesEnum,
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer
} from '@campus/dal';
import { ENVIRONMENT_SEARCHMODES_TOKEN } from '@campus/shared';
import { MockDate } from '@campus/testing';
import { MapObjectConversionService } from '@campus/utils';
import { Store, StoreModule } from '@ngrx/store';
import { EduContentsViewModel } from './edu-contents.viewmodel';

describe('BundlesViewModel', () => {
  let eduContentsViewModel: EduContentsViewModel;
  let store: Store<DalState>;

  const mockLearningAreas = [
    new LearningAreaFixture({ id: 1 }),
    new LearningAreaFixture({ id: 2 }),
    new LearningAreaFixture({ id: 3 })
  ];
  const mockFavorites = [
    new FavoriteFixture({ id: 1, learningAreaId: 2, type: 'area' }),
    new FavoriteFixture({ id: 2, learningAreaId: 3, type: 'area' }),
    new FavoriteFixture({ id: 3, eduContentId: 1, type: 'educontent' }),
    new FavoriteFixture({ id: 4, eduContentId: 2, type: 'educontent' })
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([FavoriteReducer, LearningAreaReducer])
      ],
      providers: [
        EduContentsViewModel,
        Store,
        MapObjectConversionService,
        {
          provide: EDU_CONTENT_SERVICE_TOKEN,
          useValue: {}
        },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        }
      ]
    });

    eduContentsViewModel = TestBed.get(EduContentsViewModel);
    store = TestBed.get(Store);

    store.dispatch(
      new LearningAreaActions.LearningAreasLoaded({
        learningAreas: mockLearningAreas
      })
    );
    store.dispatch(
      new FavoriteActions.FavoritesLoaded({ favorites: mockFavorites })
    );
  });

  it('should be defined', () => {
    expect(eduContentsViewModel).toBeDefined();
  });

  describe('toggle favorites', () => {
    let mockDate: MockDate;
    let spyFavAction;

    beforeEach(() => {
      mockDate = new MockDate();
      spyFavAction = jest.spyOn(FavoriteActions, 'ToggleFavorite');
    });

    afterEach(() => {
      spyFavAction.mockClear();
    });

    it('toggleFavoriteArea should dispatch ToggleFavorite action', () => {
      const area: LearningAreaInterface = new LearningAreaFixture();

      eduContentsViewModel.toggleFavoriteArea(area);

      expect(FavoriteActions.ToggleFavorite).toHaveBeenCalledTimes(1);
      expect(FavoriteActions.ToggleFavorite).toHaveBeenCalledWith({
        favorite: {
          type: FavoriteTypesEnum.AREA,
          learningAreaId: area.id,
          created: mockDate.mockDate
        }
      });
    });

    it('saveSearchState should dispatch ToggleFavorite action', () => {
      const expectedFavoriteCriteria: string = JSON.stringify({
        searchTerm: 'foo',
        filterCriteriaSelections: {
          bar: [1, 2],
          baz: [5, 6]
        }
      });

      eduContentsViewModel.saveSearchState({
        searchTerm: 'foo',
        filterCriteriaSelections: new Map([['bar', [1, 2]], ['baz', [5, 6]]])
      });

      expect(FavoriteActions.ToggleFavorite).toHaveBeenCalledTimes(1);
      expect(FavoriteActions.ToggleFavorite).toHaveBeenCalledWith({
        favorite: {
          type: FavoriteTypesEnum.SEARCH,
          criteria: expectedFavoriteCriteria,
          created: mockDate.mockDate
        }
      });
    });
  });
});
