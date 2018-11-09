import { inject, TestBed } from '@angular/core/testing';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs';
import { TaskEduContentService } from './task-edu-content.service';
import { TaskEduContentServiceInterface } from './task-edu-content.service.interface';

describe('TaskEduContentService', () => {
  let service: TaskEduContentServiceInterface;
  let mockData$: Observable<object>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskEduContentService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockData$
          }
        }
      ]
    });
    service = TestBed.get(TaskEduContentService);
  });

  it('should be created and available via DI', inject(
    [TaskEduContentService],
    (taskEduContentService: TaskEduContentService) => {
      expect(taskEduContentService).toBeTruthy();
    }
  ));

  it('should return tasksEduContents', () => {
    mockData$ = hot('-a-|', {
      a: { taskEduContents: [{ id: 12331 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });
});
