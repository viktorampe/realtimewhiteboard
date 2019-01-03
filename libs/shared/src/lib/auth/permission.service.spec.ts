import { TestBed } from '@angular/core/testing';
import { UserReducer } from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { PermissionService } from './permission.service';

describe('AuthService', () => {
  let service: PermissionService;
  let userState: UserReducer.State;

  beforeAll(() => {
    userState = {
      ...UserReducer.initialState,
      permissions: ['permission-a', 'permission-b', 'permission-c'],
      loaded: true
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(UserReducer.NAME, UserReducer.reducer, {
          initialState: userState
        })
      ],
      providers: [Store]
    });
    service = TestBed.get(PermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if permission is found', () => {
    expect(service.hasPermission('permission-a')).toBeObservable(
      hot('a', {
        a: true
      })
    );
  });

  it('should return false if permission is not found', () => {
    expect(service.hasPermission('permission-x')).toBeObservable(
      hot('a', {
        a: false
      })
    );
  });
});
