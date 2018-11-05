// file.only

import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { TaskServiceInterface } from './task.service.interface';
import { TaskService } from './tasks.service';

describe('TaskService', () => {
  let service: TaskServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(TaskService);
  });

  it('should be created and available via DI', inject(
    [TaskService],
    (taskService: TaskService) => {
      expect(taskService).toBeTruthy();
    }
  ));

  it('should return tasks', () => {
    mockData$ = hot('-a-|', {
      a: { tasks: [{ id: 12331 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });
});
