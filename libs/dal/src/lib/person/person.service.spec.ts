import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { PersonService } from './person.service';
import { PersonServiceInterface } from './person.service.interface';

describe('PersonsService', () => {
  let service: PersonServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PersonService,
        {
          provide: PersonApi,
          useValue: {
            findById: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(PersonService);
  });

  it('should be created and available via DI', inject(
    [PersonService],
    (personService: PersonService) => {
      expect(personService).toBeTruthy();
    }
  ));

  it('should return person', () => {
    mockData$ = hot('-a-|', {
      a: { id: 12331 }
    });
    expect(service.findById(1)).toBeObservable(
      hot('-a-|', {
        a: { id: 12331 }
      })
    );
  });
});
