import { TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  DalState,
  getStoreModuleForFeatures,
  UserReducer
} from '@campus/dal';
import { FilterFactoryFixture, SearchModeInterface } from '@campus/search';
import { ENVIRONMENT_SEARCHMODES_TOKEN } from '@campus/shared';
import { Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { EDU_CONTENT_SERVICE_TOKEN } from './../../../../../dal/src/lib/edu-content/edu-content.service.interface';
import { MethodViewModel } from './method.viewmodel';

describe('MethodViewModel', () => {
  let methodViewModel: MethodViewModel;
  let store: Store<DalState>;

  const searchMode: SearchModeInterface = {
    name: 'demo',
    label: 'demo',
    dynamicFilters: false,
    searchFilterFactory: FilterFactoryFixture,
    searchTerm: {
      // autocompleteEl: string; //reference to material autocomplete component
      domHost: 'hostSearchTerm'
    },
    results: {
      component: null,
      sortModes: [],
      pageSize: 3
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([UserReducer])
      ],
      providers: [
        Store,
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        {
          provide: EDU_CONTENT_SERVICE_TOKEN,
          useValue: {
            search: () => {}
          }
        },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {
            demo: searchMode
          }
        }
      ]
    });

    methodViewModel = TestBed.get(MethodViewModel);
    store = TestBed.get(Store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(methodViewModel).toBeDefined();
    });
  });
});
