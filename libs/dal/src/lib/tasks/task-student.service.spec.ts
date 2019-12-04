import { TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { TaskStudentService } from './task-student.service';
import { TaskStudentServiceInterface } from './task-student.service.interface';

describe('TaskStudentService', () => {
  let service: TaskStudentServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskStudentService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(TaskStudentService);
  });

  it('should be created and available via DI', () => {
    expect(service).toBeTruthy();
  });

  it('should return taskStudents', () => {
    mockData$ = hot('-a-|', {
      a: { taskStudents: [{ id: 12331 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });
});
