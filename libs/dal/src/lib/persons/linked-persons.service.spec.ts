import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import {
  LinkedPersonService,
  LinkedPersonServiceInterface
} from './linked-persons.service';

describe('LinkedPersonsService', () => {
  let service: LinkedPersonServiceInterface;
  let mockData$: any;
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

  it('should be created', inject(
    [LinkedPersonService],
    (service: LinkedPersonService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should return persons', async () => {
    mockData$ = hot('-a-|', {
      a: { teacherStudents: [{ id: 1, teacherId: 1, studentId: 2 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 1, teacherId: 1, studentId: 2 }]
      })
    );
  });
});
