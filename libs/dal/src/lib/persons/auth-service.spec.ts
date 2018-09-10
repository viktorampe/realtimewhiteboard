import { inject, TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';

describe('CredentialsService', () => {
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
