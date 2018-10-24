import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { LinkedPersonService } from './linked-person.service';

describe('PersonsService', () => {
  let service: LinkedPersonService;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LinkedPersonService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(LinkedPersonService);
  });

  it('should be created and available via DI', inject(
    [LinkedPersonService],
    (linkedPersonService: LinkedPersonService) => {
      expect(linkedPersonService).toBeTruthy();
    }
  ));

  it('should return linked persons list', () => {
    mockData$ = hot('-a-|', {
      a: { persons: [{ id: 12331 }] }
    });
    expect(service.getPersons(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });

  it('should return teacherStudents list', () => {
    mockData$ = hot('-a-|', {
      a: { teacherStudents: [{ id: 12331 }] }
    });
    expect(service.getTeacherStudents(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });
});
