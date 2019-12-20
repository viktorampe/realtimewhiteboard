import { inject, TestBed } from '@angular/core/testing';
import { PersonApi, TaskApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { TaskEduContentInterface } from '../+models';
import { TaskServiceInterface } from './task.service.interface';
import { TaskService } from './tasks.service';

describe('TaskService', () => {
  let service: TaskServiceInterface;
  let taskApi: TaskApi;
  let mockGetData$: Observable<object>;
  let mockLinkEduContentsResult$: Observable<TaskEduContentInterface>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockGetData$
          }
        },
        {
          provide: TaskApi,
          useValue: {
            linkEduContents: () => mockLinkEduContentsResult$
          }
        }
      ]
    });
    service = TestBed.get(TaskService);
    taskApi = TestBed.get(TaskApi);
  });

  it('should be created and available via DI', inject(
    [TaskService],
    (taskService: TaskService) => {
      expect(taskService).toBeTruthy();
    }
  ));

  it('should return tasks', () => {
    mockGetData$ = hot('-a-|', {
      a: { tasks: [{ id: 12331 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });
  describe('linkEduContent', () => {
    it('should return the link result', () => {
      const mockLinkEduContentsResult = {
        index: 10000,
        id: 49,
        teacherId: 186,
        eduContentId: 9,
        taskId: 1
      };
      mockLinkEduContentsResult$ = hot('-a-|', {
        a: mockLinkEduContentsResult
      });
      const spy = jest.spyOn(taskApi, 'linkEduContents');
      expect(service.linkEduContent(1, 9)).toBeObservable(
        hot('-a-|', {
          a: mockLinkEduContentsResult
        })
      );
      expect(spy).toHaveBeenCalledWith(1, 9);
    });
  });
});
