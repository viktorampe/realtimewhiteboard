import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { PersonFixture } from '../+fixtures';
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
            getData: () => mockData$
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
});
