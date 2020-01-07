import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DalState,
  StateFeatureBuilder,
  UserActions,
  UserReducer
} from '@campus/dal';
import { PermissionService, PERMISSION_SERVICE_TOKEN } from '@campus/shared';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { PermissionGuard } from './permission.guard';

describe('PermissionGuard', () => {
  let permissionGuard: PermissionGuard;
  const navigateSpy = jest.fn();
  let store: Store<DalState>;
  class MockRouter {
    navigate = navigateSpy;
  }

  afterEach(() => {
    jest.resetAllMocks();
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
        ...StateFeatureBuilder.getStoreModuleForFeatures([UserReducer]),
        RouterTestingModule
      ],
      providers: [
        PermissionGuard,
        Store,
        { provide: Router, useClass: MockRouter },
        { provide: PERMISSION_SERVICE_TOKEN, useClass: PermissionService }
      ]
    });
    permissionGuard = TestBed.get(PermissionGuard);
    store = TestBed.get(Store);
  });
  it('should return true if route.data contains no requiredPermissions', () => {
    const route = { data: {} } as unknown;
    expect(
      permissionGuard.canActivate(
        <ActivatedRouteSnapshot>route,
        <RouterStateSnapshot>{}
      )
    ).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
  it('should return true if route.data.requiredPermissions is an empty array', () => {
    const route = { data: { requiredPermissions: [] } } as unknown;
    expect(
      permissionGuard.canActivate(
        <ActivatedRouteSnapshot>route,
        <RouterStateSnapshot>{}
      )
    ).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
  it('should return false if route.data.requiredPermissions contains a permission but the user has no permissions', () => {
    const route = {
      data: { requiredPermissions: ['somePermission'] }
    } as unknown;
    expect(
      permissionGuard.canActivate(
        <ActivatedRouteSnapshot>route,
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: false }));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/error/401']);
  });
  it('should return true if route.data.requiredPermissions contains the permission that the user has', () => {
    store.dispatch(new UserActions.PermissionsLoaded(['somePermission']));
    const route = {
      data: { requiredPermissions: ['somePermission'] }
    } as any;
    expect(
      permissionGuard.canActivate(
        <ActivatedRouteSnapshot>route,
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: true }));
    expect(navigateSpy).not.toHaveBeenCalled();
  });
  it('should return true if route.data.requiredPermissions contains all the permission that the user has', () => {
    store.dispatch(
      new UserActions.PermissionsLoaded([
        'somePermission',
        'someOtherPermission'
      ])
    );
    const route = {
      data: { requiredPermissions: ['somePermission', 'someOtherPermission'] }
    } as any;
    expect(
      permissionGuard.canActivate(
        <ActivatedRouteSnapshot>route,
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: true }));
    expect(navigateSpy).not.toHaveBeenCalled();
  });
  it('should return false if route.data.requiredPermissions contains more permissions than the user has', () => {
    store.dispatch(
      new UserActions.PermissionsLoaded([
        'somePermission',
        'somePermissionThatIsNotRelated'
      ])
    );
    const route = {
      data: { requiredPermissions: ['somePermission', 'someOtherPermission'] }
    } as any;
    expect(
      permissionGuard.canActivate(
        <ActivatedRouteSnapshot>route,
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: false }));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/error/401']);
  });
});
