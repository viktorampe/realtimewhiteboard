import { inject, TestBed } from '@angular/core/testing';
import {
  LoopBackAuth,
  PersonApi,
  SDKToken
} from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { PersonInterface } from '../+models/Person.interface';
import { AuthService } from './auth-service';
import { LoginCredentials } from './auth-service.interface';

const mockPerson = {
  email: 'brol'
};

let mockData$: any;

class MockPersonApi {
  getCurrentId(): number {
    return 1;
  }

  getCurrent(): Observable<PersonInterface> {
    return of(mockPerson);
  }

  logout(): Observable<any> {
    return of(null);
  }

  login(credentials: Partial<LoginCredentials>): Observable<any> {
    return of({
      user: mockPerson
    });
  }

  getData(): Observable<string[]> {
    return mockData$;
  }
}

describe('AuthService', () => {
  let authService: AuthService;
  const setTokenSpy = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: PersonApi, useValue: new MockPersonApi() },
        {
          provide: LoopBackAuth,
          useValue: {
            setToken: setTokenSpy,
            setRememberMe: jest.fn()
          }
        }
      ]
    });

    authService = TestBed.get(AuthService);
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it('should give a valid current user', inject(
    [AuthService],
    (service: AuthService) => {
      service.getCurrent().subscribe((ob: PersonInterface) => {
        expect(ob).toBe(mockPerson);
      });
    }
  ));

  it('should give a valid login', inject(
    [AuthService],
    (service: AuthService) => {
      service
        .login({ email: 'brol', password: 'brol' })
        .subscribe((ob: any) => {
          expect(ob.user).toBe(mockPerson);
        });
    }
  ));

  it('should give a valid logout', inject(
    [AuthService],
    (service: AuthService) => {
      service.logout().subscribe((ob: PersonInterface) => {
        expect(ob).toBe(null);
      });
    }
  ));

  it('should return a permissions array', () => {
    mockData$ = hot('-a-|', {
      a: { permissions: ['permission-1', 'permission-2'] }
    });
    expect(authService.getPermissions()).toBeObservable(
      hot('-a-|', {
        a: ['permission-1', 'permission-2']
      })
    );
  });

  it('should call loopbackAuth and set a token', () => {
    authService.loginWithToken('taukun', 'itsme');
    expect(setTokenSpy).toHaveBeenCalledWith(
      new SDKToken({
        id: 'taukun',
        userId: 'itsme',
        scopes: null
      })
    );
  });
});
