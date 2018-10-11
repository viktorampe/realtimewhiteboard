import { inject, TestBed } from '@angular/core/testing';
import { LoginCredentials, PersonInterface } from '@campus/dal';
import { LoopBackAuth, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth-service';

const mockPerson = {
  email: 'brol'
};

class MockPersonApi {
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
}

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: PersonApi, useValue: new MockPersonApi() },
        { provide: LoopBackAuth, useValue: {} }
      ]
    });
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
});
