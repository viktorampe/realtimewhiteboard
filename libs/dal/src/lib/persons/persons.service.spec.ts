import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { PersonFixture } from '../+fixtures';
import { PersonInterface } from '../+models';
import {
  PersonService,
  PersonServiceInterface,
  PERSON_SERVICE_TOKEN
} from './persons.service';

describe('PersonsService', () => {
  let service: PersonServiceInterface;
  let mockData$: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PERSON_SERVICE_TOKEN, useClass: PersonService },
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$,
            checkUnique: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(PersonService);
  });

  it('should be created', inject(
    [PERSON_SERVICE_TOKEN],
    (srv: PersonServiceInterface) => {
      expect(srv).toBeTruthy();
    }
  ));

  it('should return persons', async () => {
    mockData$ = hot('-a-|', {
      a: { persons: [new PersonFixture()] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [new PersonFixture()]
      })
    );
  });

  it('should check for unique username', () => {
    mockData$ = hot('-a|', {
      a: true
    });
    expect(service.checkUniqueUsername(1, 'foo')).toBeObservable(mockData$);
  });
  it('should check for unique email', () => {
    mockData$ = hot('-a|', {
      a: true
    });
    expect(service.checkUniqueEmail(1, 'foo')).toBeObservable(mockData$);
  });
  
  describe('updateUser', () => {
    let personApi: PersonApi;
    let mockData;

    beforeEach(() => {
      personApi = TestBed.get(PersonApi);
      mockData = {
        userId: 34,
        changedUserData: { firstName: 'foo' } as Partial<PersonInterface>
      };
    });

    it('should call the api to update a user', () => {
      const mockResponse = hot('a', { a: true });
      personApi.patchAttributes = jest.fn().mockReturnValue(mockResponse);

      const response = service.updateUser(
        mockData.userId,
        mockData.changedUserData
      );

      expect(response).toBeObservable(mockResponse);
      expect(personApi.patchAttributes).toHaveBeenCalledTimes(1);
      expect(personApi.patchAttributes).toHaveBeenCalledWith(
        mockData.userId,
        mockData.changedUserData
      );
    });

    it('should throw an error when the api does', () => {
      personApi.patchAttributes = jest
        .fn()
        .mockRejectedValue(new Error('this is an error'));

      expect(() =>
        service.updateUser(mockData.userId, mockData.changedUserData)
      ).toThrow();
    });
  });
});
