import { TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { TaskClassGroupServiceInterface } from '.';
import { TaskClassGroupService } from './task-class-group.service';

describe('TaskClassGroupService', () => {
  let service: TaskClassGroupServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskClassGroupService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(TaskClassGroupService);
  });

  it('should be created and available via DI', () => {
    expect(service).toBeTruthy();
  });

  it('should return taskClassGroups', () => {
    mockData$ = hot('-a-|', {
      a: { taskClassGroups: [{ id: 12331 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });
});
