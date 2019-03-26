import { Component, OnInit } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CustomSerializer,
  DalState,
  FavoriteReducer,
  getStoreModuleForFeatures,
  LearningAreaReducer
} from '@campus/dal';
import { SearchStateInterface } from '@campus/search';
import {
  NavigationActionTiming,
  routerReducer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject } from 'rxjs';
import { EduContentsViewModel } from './edu-contents.viewmodel';

@Component({
  selector: 'campus-mock-component',
  template: ``,
  styles: [``]
})
export class MockComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

describe('EduContentsViewModel', () => {
  let eduContentsViewModel: EduContentsViewModel;
  let store: Store<DalState>;
  let router: Router;

  const mockSearchState: SearchStateInterface = {
    searchTerm: 'not this',
    filterCriteriaSelections: new Map<string, (number | string)[]>([])
  };

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
            path: 'edu-contents',
            component: MockComponent,
            children: [
              {
                path: ':area',
                component: MockComponent
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
      declarations: [MockComponent],
      providers: [EduContentsViewModel, Store]
    });

    eduContentsViewModel = TestBed.get(EduContentsViewModel);
    store = TestBed.get(Store);
    router = TestBed.get(Router);
    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(eduContentsViewModel).toBeDefined();
  });

  describe('updateState', () => {
    it('should update the stream with the given value', () => {
      eduContentsViewModel['searchState$'] = new BehaviorSubject<
        SearchStateInterface
      >(null);
      eduContentsViewModel.updateState(mockSearchState);
      expect(eduContentsViewModel['searchState$']).toBeObservable(
        hot('a', { a: mockSearchState })
      );
    });
  });
  describe('getInitialSearchState', () => {
    it('should add the correct filterCriteriaSelections', fakeAsync(() => {
      eduContentsViewModel['searchState$'] = new BehaviorSubject<
        SearchStateInterface
      >(mockSearchState);
      [
        {
          usedRoute: '/',
          expectedMap: new Map<string, (number | string)[]>([])
        },
        {
          usedRoute: '/edu-contents',
          expectedMap: new Map<string, (number | string)[]>([])
        },
        {
          usedRoute: '/edu-contents/34',
          expectedMap: new Map<string, (number | string)[]>([
            ['learningArea', [34]]
          ])
        }
      ].forEach(value => {
        router.navigate([value.usedRoute]);
        tick();
        expect(eduContentsViewModel.getInitialSearchState()).toBeObservable(
          hot('a', {
            a: {
              searchTerm: 'not this',
              filterCriteriaSelections: value.expectedMap
            }
          })
        );
      });
    }));
  });
});
