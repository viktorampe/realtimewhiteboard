import { TestBed } from '@angular/core/testing';
import { UserReducer } from '@campus/dal';
import { StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { PermissionService } from './permission.service';
import {
  PermissionServiceInterface,
  PERMISSION_SERVICE_TOKEN
} from './permission.service.interface';

describe('PermissionService', () => {
  let service: PermissionServiceInterface;
  let userState: UserReducer.State;

  beforeAll(() => {
    userState = {
      ...UserReducer.initialState,
      loaded: true,
      permissions: ['permission-a', 'permission-b', 'permission-c'],
      permissionsLoaded: true
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        StoreModule.forFeature(UserReducer.NAME, UserReducer.reducer, {
          initialState: userState
        })
      ],
      providers: [
        { provide: PERMISSION_SERVICE_TOKEN, useClass: PermissionService }
      ]
    });
    service = TestBed.get(PERMISSION_SERVICE_TOKEN);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if permission is found', () => {
    expect(service.hasPermission$('permission-a')).toBeObservable(
      hot('a', { a: true })
    );
  });

  it('should return false if permission is not found', () => {
    expect(service.hasPermission$('permission-x')).toBeObservable(
      hot('a', { a: false })
    );
  });

  it('should return true if all permissions are met in the array', () => {
    expect(
      service.hasPermission$(['permission-b', 'permission-a'])
    ).toBeObservable(hot('a', { a: true }));
  });

  it('should return false if not all permissions are met in the array', () => {
    expect(
      service.hasPermission$(['permission-x', 'permission-a'])
    ).toBeObservable(hot('a', { a: false }));
  });

  it('should return true if at least one permission is found in an array of permissions', () => {
    expect(
      service.hasPermission$([['permission-x', 'permission-a']])
    ).toBeObservable(hot('a', { a: true }));
  });

  it('should return true if all conditions are met for combination of string and arrays', () => {
    expect(
      service.hasPermission$([['permission-x', 'permission-a'], 'permission-b'])
    ).toBeObservable(hot('a', { a: true }));
  });

  it('should return false if not all conditions are met for combination of string and arrays', () => {
    expect(
      service.hasPermission$([['permission-x', 'permission-a'], 'permission-y'])
    ).toBeObservable(hot('a', { a: false }));

    expect(
      service.hasPermission$([['permission-x', 'permission-y'], 'permission-b'])
    ).toBeObservable(hot('a', { a: false }));
  });
});
