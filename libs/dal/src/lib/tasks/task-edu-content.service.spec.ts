import { inject, TestBed } from '@angular/core/testing';
import { PersonApi, TaskEduContentApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { TaskEduContentService } from './task-edu-content.service';
import { TaskEduContentServiceInterface } from './task-edu-content.service.interface';

describe('TaskEduContentService', () => {
  let service: TaskEduContentServiceInterface;
  let mockGetData$: Observable<object>;
  let mockDeleteById$: Observable<boolean>;
  const mockPersonApi = {
    getData: jest.fn().mockImplementation(() => mockGetData$)
  };
  const mockTaskEduContentApi = {
    deleteById: jest.fn().mockImplementation(() => mockDeleteById$)
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new TaskEduContentService(
      mockPersonApi as any,
      mockTaskEduContentApi as any
    );
  });

  describe('Dependency injection', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          TaskEduContentService,
          { provide: PersonApi, useValue: {} },
          { provide: TaskEduContentApi, useValue: {} }
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
  });

  it('should return tasksEduContents', () => {
    mockGetData$ = hot('-a-|', {
      a: { taskEduContents: [{ id: 12331 }] }
    });
    expect(service.getAllForUser(1)).toBeObservable(
      hot('-a-|', {
        a: [{ id: 12331 }]
      })
    );
  });

  it('should remove a single taskEduContent', () => {
    mockDeleteById$ = hot('-a-|', {
      a: true
    });
    expect(service.remove(1)).toBeObservable(
      hot('-a-|', {
        a: true
      })
    );

    expect(mockTaskEduContentApi.deleteById).toHaveBeenCalledWith(1);
  });

  it('should remove multiple taskEduContents', () => {
    mockDeleteById$ = hot('-a-|', {
      a: true
    });
    expect(service.removeAll([1, 2, 3])).toBeObservable(
      hot('---(a|)', {
        a: true
      })
    );

    expect(mockTaskEduContentApi.deleteById).toHaveBeenCalledWith(3);
    expect(mockTaskEduContentApi.deleteById).toHaveBeenCalledWith(2);
    expect(mockTaskEduContentApi.deleteById).toHaveBeenCalledWith(1);
  });
});
