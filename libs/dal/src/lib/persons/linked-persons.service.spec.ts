import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { PersonFixture } from '../+fixtures';
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
    (srv: LinkedPersonService) => {
      expect(srv).toBeTruthy();
    }
  ));

  describe('getAllForUser', () => {
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

  describe('getTeacherStudentsForUser', () => {
    it('should return relation info', async () => {
      mockData$ = hot('-a-|', {
        a: { teacherStudents: [{ id: 1, teacherId: 1, studentId: 2 }] }
      });
      expect(service.getTeacherStudentsForUser(1)).toBeObservable(
        hot('-a-|', {
          a: [{ id: 1, teacherId: 1, studentId: 2 }]
        })
      );
    });
  });
});
