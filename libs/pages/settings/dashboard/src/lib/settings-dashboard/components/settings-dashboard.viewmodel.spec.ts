import { TestBed } from '@angular/core/testing';
import { DalState } from '@campus/dal';
import {
  ENVIRONMENT_UI_TOKEN,
  NAVIGATION_ITEM_SERVICE_TOKEN
} from '@campus/shared';
import { Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { SettingsDashboardViewModel } from './settings-dashboard.viewmodel';

describe('SettingsDashboardViewModel', () => {
  let settingsDashboardViewModel: SettingsDashboardViewModel;
  let store: Store<DalState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictActionImmutability: false,
              strictStateImmutability: false
            }
          }
        )
      ],
      providers: [
        SettingsDashboardViewModel,
        Store,
        {
          provide: NAVIGATION_ITEM_SERVICE_TOKEN,
          useValue: {}
        },
        {
          provide: ENVIRONMENT_UI_TOKEN,
          useValue: {}
        }
      ]
    });
  });

  beforeEach(() => {
    settingsDashboardViewModel = TestBed.get(SettingsDashboardViewModel);
    store = TestBed.get(Store);
  });

  it('should be defined', () => {
    expect(settingsDashboardViewModel).toBeDefined();
  });
});
