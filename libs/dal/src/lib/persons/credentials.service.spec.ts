import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { cold } from 'jasmine-marbles';
import { CredentialFixture } from './../+fixtures/Credential.fixture';
import {
  CredentialService,
  CREDENTIAL_SERVICE_TOKEN
} from './credentials.service';

describe('CredentialsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: CREDENTIAL_SERVICE_TOKEN, useClass: CredentialService },
        { provide: PersonApi, useValue: {} }
      ]
    })
  );

  it('should be created', inject(
    [CREDENTIAL_SERVICE_TOKEN],
    (srv: CredentialService) => {
      expect(srv).toBeTruthy();
    }
  ));

  it('should return credentials', async () => {
    const mockFixture = new CredentialFixture();

    const credentialService = TestBed.get(CREDENTIAL_SERVICE_TOKEN);
    const mockresponse$ = cold('-a-|', { a: [mockFixture, mockFixture] });

    credentialService.getAllForUser = jest.fn().mockReturnValue(mockresponse$);

    expect(credentialService.getAllForUser(1)).toBeObservable(
      cold('-a-|', {
        a: [mockFixture, mockFixture]
      })
    );
  });
});
