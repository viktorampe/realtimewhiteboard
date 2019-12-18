import { TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { TaskGroupService } from './task-group.service';
import { TaskGroupServiceInterface } from './task-group.service.interface';

describe('TaskGroupService', () => {
  let service: TaskGroupServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskGroupService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(TaskGroupService);
  });

  it('should be created and available via DI', () => {
    expect(service).toBeTruthy();
  });

  it('should return taskGroups', () => {
    mockData$ = hot('-a-|', {
      a: { taskGroups: [{ id: 12331, start: 1, end: 1 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331, start: new Date(1), end: new Date(1) }]
      })
    );
  });
});
