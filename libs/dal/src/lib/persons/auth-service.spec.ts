import { inject, TestBed } from '@angular/core/testing';
import { LoopBackAuth, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { AuthService } from './auth-service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: PersonApi, useValue: {} },
        { provide: LoopBackAuth, useValue: {} }
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
