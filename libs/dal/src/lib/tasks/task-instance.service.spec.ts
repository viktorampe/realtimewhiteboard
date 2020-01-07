import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { TaskInstanceService } from './task-instance.service';
import { TaskInstanceServiceInterface } from './task-instance.service.interface';

describe('TaskInstanceService', () => {
  let service: TaskInstanceServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskInstanceService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(TaskInstanceService);
  });

  it('should be created and available via DI', inject(
    [TaskInstanceService],
    (taskInstanceService: TaskInstanceService) => {
      expect(taskInstanceService).toBeTruthy();
    }
  ));

  it('should return tasks', () => {
    mockData$ = hot('-a-|', {
      a: { taskInstances: [{ id: 12331 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });
});
