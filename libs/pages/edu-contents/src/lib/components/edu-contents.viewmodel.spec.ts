import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CustomSerializer,
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
import { SearchStateInterface } from '@campus/search';
import { ENVIRONMENT_SEARCHMODES_TOKEN } from '@campus/shared';
import { MockDate } from '@campus/testing';
import { MapObjectConversionService } from '@campus/utils';
import {
  NavigationActionTiming,
  routerReducer,
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject, of } from 'rxjs';
import { EduContentsViewModel } from './edu-contents.viewmodel';

describe('EduContentsViewModel', () => {
  let eduContentsViewModel: EduContentsViewModel;
  let router: Router;
  let eduContentService;

  const mockSearchState: SearchStateInterface = {
    searchTerm: 'not this',
    filterCriteriaSelections: new Map<string, (number | string)[]>([
      ['thing', ['one', 'two']],
      ['other thing', ['three', 'four']]
    ])
  };

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
        RouterTestingModule.withRoutes([
          {
            path: '',
            redirectTo: 'edu-content',
            pathMatch: 'full'
          },
          {
            path: 'edu-content',
            component: Component,
            children: [
              {
                path: ':area',
                component: Component
              }
            ]
          }
        ]),
        StoreModule.forRoot({ router: routerReducer }),
        ...getStoreModuleForFeatures([FavoriteReducer, LearningAreaReducer]),
        StoreRouterConnectingModule.forRoot({
          navigationActionTiming: NavigationActionTiming.PostActivation,
          serializer: CustomSerializer
        })
      ],
      providers: [
        EduContentsViewModel,
        Store,
        MapObjectConversionService,
        { provide: RouterStateSerializer, useClass: CustomSerializer },
        {
          provide: EDU_CONTENT_SERVICE_TOKEN,
          useValue: {
            autoComplete: (state: SearchStateInterface) => {
              return of(['strings', 'for', 'autocomplete']);
            }
          }
        },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        }
      ]
    });
    eduContentsViewModel = TestBed.get(EduContentsViewModel);
    eduContentService = TestBed.get(EDU_CONTENT_SERVICE_TOKEN);
    router = TestBed.get(Router);
    store = TestBed.get(Store);

    router.initialNavigation();
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

  describe('requestAutoComplete', () => {
    it('should call autoComplete on the eduContentService', () => {
      const autoCompleteSpy = jest.spyOn(eduContentService, 'autoComplete');
      const mockNewSearchTerm = 'new search term';
      eduContentsViewModel['searchState$'] = new BehaviorSubject<
        SearchStateInterface
      >(mockSearchState);
      eduContentsViewModel.requestAutoComplete(mockNewSearchTerm);
      expect(autoCompleteSpy).toHaveBeenCalledTimes(1);
      expect(autoCompleteSpy).toHaveBeenCalledWith({
        ...mockSearchState,
        searchTerm: mockNewSearchTerm
      });
    });
  });

  describe('learningAreas$', () => {
    it('should return all the learningareas', () => {
      expect(eduContentsViewModel.learningAreas$).toBeObservable(
        hot('a', { a: mockLearningAreas })
      );
    });
  });

  describe('favoriteLearningAreas$', () => {
    it('should return the favorite learningareas', () => {
      expect(eduContentsViewModel.favoriteLearningAreas$).toBeObservable(
        hot('a', {
          a: mockLearningAreas.filter(area => [2, 3].indexOf(area.id) !== -1)
        })
      );
    });
  });

  describe('eduContentFavorites$', () => {
    it('should return the eduContent favorites', () => {
      expect(eduContentsViewModel.eduContentFavorites$).toBeObservable(
        hot('a', {
          a: mockFavorites.filter(favorite => favorite.type === 'educontent')
        })
      );
    });
  });

  describe('learningArea$', () => {
    it('should return the learningarea for current route', fakeAsync(() => {
      router.navigate(['edu-content', '1']);
      tick();
      expect(eduContentsViewModel.learningArea$).toBeObservable(
        hot('a', {
          a: mockLearningAreas[0]
        })
      );
    }));
  });
});
