import { inject, TestBed } from '@angular/core/testing';
import { PersonApi, TaskEduContentApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { TaskEduContentFixture } from '../+fixtures';
import { TaskEduContentService } from './task-edu-content.service';
import { TaskEduContentServiceInterface } from './task-edu-content.service.interface';

describe('TaskEduContentService', () => {
  let service: TaskEduContentServiceInterface;
  let mockGetData$: Observable<object>;
  let mockDeleteById$: Observable<boolean>;

  const mockUpdateTaskEduContentInfo = { tasks: [], errors: [] };

  const mockPersonApi = {
    getData: jest.fn().mockImplementation(() => mockGetData$)
  };
  const mockTaskEduContentApi = {
    deleteById: jest.fn().mockImplementation(() => mockDeleteById$),
    updateTaskEduContents: jest.fn()
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

  describe('should call api and return results when bulk update', () => {
    const taskEduContents = [
      new TaskEduContentFixture({ id: 1 }),
      new TaskEduContentFixture({ id: 2 })
    ];
    const userId = 123;
    let updateTaskEduContentssSpy: jest.SpyInstance;

    beforeEach(() => {
      updateTaskEduContentssSpy = mockTaskEduContentApi.updateTaskEduContents = jest.fn();
      updateTaskEduContentssSpy.mockReturnValue(
        hot('a', { a: mockUpdateTaskEduContentInfo })
      );
    });

    it('should call the api and return the result', () => {
      expect(
        service.updateTaskEduContents(userId, taskEduContents)
      ).toBeObservable(hot('a', { a: mockUpdateTaskEduContentInfo }));

      expect(updateTaskEduContentssSpy).toHaveBeenCalledWith(taskEduContents);
    });
  });
});
