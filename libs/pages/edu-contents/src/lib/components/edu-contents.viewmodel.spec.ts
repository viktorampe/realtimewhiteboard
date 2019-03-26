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
  getStoreModuleForFeatures,
  LearningAreaActions,
  LearningAreaFixture,
  LearningAreaReducer
} from '@campus/dal';
import { SearchStateInterface } from '@campus/search';
import { ENVIRONMENT_SEARCHMODES_TOKEN } from '@campus/shared';
import {
  NavigationActionTiming,
  routerReducer,
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import { EduContentsViewModel } from './edu-contents.viewmodel';

describe('EduContentsViewModel', () => {
  let eduContentsViewModel: EduContentsViewModel;
  let router: Router;
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

  describe('autoCompleteValues$', () => {
    it('should be updated when searchTerm$ is updated', fakeAsync(() => {
      let autoCompleteValues;
      eduContentsViewModel.autoCompleteValues$.subscribe(values => {
        autoCompleteValues = values;
      });
      eduContentsViewModel.searchTerm$.next('foo');
      tick(500);
      expect(autoCompleteValues).toEqual(['strings', 'for', 'autocomplete']);
    }));
  });
});
