import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { cold } from 'jasmine-marbles';
import { CredentialFixture } from './../+fixtures/Credential.fixture';
import {
  CredentialService,
  CREDENTIAL_SERVICE_TOKEN
} from './credential.service';

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

  describe('getAllForUser', () => {
    it('should return credentials', async () => {
      const mockCredential = new CredentialFixture();

      const credentialService = TestBed.get(CREDENTIAL_SERVICE_TOKEN);

      const mockresponse$ = cold('-a-|', {
        a: [mockCredential, mockCredential]
      });
      const personApi = TestBed.get(PersonApi);
      personApi.getCredentials = jest.fn().mockReturnValue(mockresponse$);

      expect(credentialService.getAllForUser(1)).toBeObservable(
        cold('-a-|', {
          a: [mockCredential, mockCredential]
        })
      );
    });
  });

  describe('unlinkCredential', () => {
    it('should call the api', async () => {
      const mockCredential = new CredentialFixture();
      const credentialService = TestBed.get(CREDENTIAL_SERVICE_TOKEN);

      const mockresponse$ = cold('-a-|', { a: true });
      const personApi = TestBed.get(PersonApi);
      personApi.destroyByIdCredentials = jest
        .fn()
        .mockReturnValue(mockresponse$);

      credentialService.unlinkCredential(mockCredential);

      expect(personApi.destroyByIdCredentials).toHaveBeenCalled();
      expect(personApi.destroyByIdCredentials).toHaveBeenCalledWith(
        mockCredential.userId,
        mockCredential.id
      );
    });
  });

  describe('useCredentialProfilePicture', () => {
    it('should call the api', async () => {
      const mockCredential = new CredentialFixture();
      const credentialService = TestBed.get(CREDENTIAL_SERVICE_TOKEN);

      const mockresponse$ = cold('-a-|', { a: true });
      const personApi = TestBed.get(PersonApi);
      personApi.useAvatarFromCredential = jest
        .fn()
        .mockReturnValue(mockresponse$);

      credentialService.useCredentialProfilePicture(mockCredential);

      expect(personApi.useAvatarFromCredential).toHaveBeenCalled();
      expect(personApi.useAvatarFromCredential).toHaveBeenCalledWith(
        mockCredential.userId,
        mockCredential.id
      );
    });
  });
});
