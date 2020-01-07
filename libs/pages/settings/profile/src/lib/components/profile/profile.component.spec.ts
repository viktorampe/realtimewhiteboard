import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AUTH_SERVICE_TOKEN,
  getStoreModuleForFeatures,
  PersonFixture,
  UserReducer
} from '@campus/dal';
import { ENVIRONMENT_UI_TOKEN } from '@campus/shared';
import { Store, StoreModule } from '@ngrx/store';
import { ProfileViewModel } from '../profile.viewmodel';
import { MockProfileViewModel } from '../profile.viewmodel.mock';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let vm: ProfileViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: true,
              strictActionImmutability: true
            }
          }
        ),
        ...getStoreModuleForFeatures([UserReducer])
      ],
      providers: [
        Store,
        {
          provide: ProfileViewModel,
          useClass: MockProfileViewModel
        },
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: {
            userId: 1
          }
        },
        {
          provide: ENVIRONMENT_UI_TOKEN,
          useValue: {
            useInfoPanelStyle: true
          }
        }
      ],
      declarations: [ProfileComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    vm = TestBed.get(ProfileViewModel);
    fixture.detectChanges();
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set the current user', () => {
      expect(component.user$).toBeDefined();
    });
  });

  describe('onSaveProfile()', () => {
    it('should trigger the viewmodel', () => {
      const vmSpy = jest.spyOn(vm, 'updateProfile');
      const changes = new PersonFixture({ displayName: 'FooBarFoo' });
      component.onSaveProfile(changes);
      expect(vmSpy).toHaveBeenCalledTimes(1);
      expect(vmSpy).toHaveBeenCalledWith(changes);
    });
  });
});
