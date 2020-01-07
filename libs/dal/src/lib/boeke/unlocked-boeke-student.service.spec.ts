import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { UnlockedBoekeStudentService } from './unlocked-boeke-student.service';

describe('UnlockedBoekeStudentService', () => {
  let service: UnlockedBoekeStudentService;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnlockedBoekeStudentService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(UnlockedBoekeStudentService);
  });

  it('should be created', inject(
    [UnlockedBoekeStudentService],
    (unlockedBoekeStudentService: UnlockedBoekeStudentService) => {
      expect(unlockedBoekeStudentService).toBeTruthy();
    }
  ));
  it('should return unlockedBoekeStudents', () => {
    mockData$ = hot('-a-|', {
      a: {
        unlockedBoekeStudents: [
          {
            id: 1
          }
        ]
      }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [
          {
            id: 1
          }
        ]
      })
    );
  });
});
