import { inject, TestBed } from '@angular/core/testing';
import { PersonApi, TaskApi } from '@diekeure/polpo-api-angular-sdk';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import {
  TaskClassGroupFixture,
  TaskFixture,
  TaskGroupFixture,
  TaskStudentFixture
} from '../+fixtures';
import { TaskEduContentInterface, TaskInterface } from '../+models';
import { TaskServiceInterface } from './task.service.interface';
import { TaskService } from './tasks.service';

describe('TaskService', () => {
  let service: TaskServiceInterface;
  let taskApi: TaskApi;
  let personApi: PersonApi;
  let mockGetData$: Observable<object>;
  let mockLinkEduContentsResult$: Observable<TaskEduContentInterface>;
  let mockUpdatedAccessResult$: Observable<TaskInterface>;

  const mockUpdateTaskInfo = { tasks: [], errors: [] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        {
          provide: PersonApi,
          useValue: {
            getData: () => mockGetData$,
            createTask: () => {}
          }
        },
        {
          provide: TaskApi,
          useValue: {
            linkEduContents: () => mockLinkEduContentsResult$,
            updateTasks: () => {},
            destroyTasks: () => {},
            updateAccess: () => mockUpdatedAccessResult$
          }
        }
      ]
    });
    service = TestBed.get(TaskService);
    taskApi = TestBed.get(TaskApi);
    personApi = TestBed.get(PersonApi);
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

  describe('updateTasks', () => {
    const tasks = [new TaskFixture({ id: 1 }), new TaskFixture({ id: 2 })];
    const userId = 123;
    let updateTasksSpy: jest.SpyInstance;

    beforeEach(() => {
      updateTasksSpy = taskApi.updateTasks = jest.fn();
      updateTasksSpy.mockReturnValue(hot('a', { a: mockUpdateTaskInfo }));
    });

    it('should call the api and return the result', () => {
      expect(service.updateTasks(userId, tasks)).toBeObservable(
        hot('a', { a: mockUpdateTaskInfo })
      );

      expect(updateTasksSpy).toHaveBeenCalledWith(tasks);
    });
  });

  describe('deleteTasks', () => {
    const taskIds = [1, 2];
    const userId = 123;
    let destroyTasksSpy: jest.SpyInstance;

    beforeEach(() => {
      destroyTasksSpy = taskApi.destroyTasks = jest.fn();
      destroyTasksSpy.mockReturnValue(hot('a', { a: mockUpdateTaskInfo }));
    });

    it('should call the api and return the result', () => {
      expect(service.deleteTasks(userId, taskIds)).toBeObservable(
        hot('a', { a: mockUpdateTaskInfo })
      );
      expect(destroyTasksSpy).toHaveBeenCalledWith(taskIds);
    });
  });

  describe('createTask', () => {
    const task = new TaskFixture({ id: undefined });
    const userId = 123;
    let createTaskSpy: jest.SpyInstance;

    beforeEach(() => {
      createTaskSpy = personApi.createTeacherTasks = jest.fn();
      createTaskSpy.mockReturnValue(hot('a', { a: new TaskFixture() }));
    });

    it('should call the api and return the result', () => {
      expect(service.createTask(userId, task)).toBeObservable(
        hot('a', { a: new TaskFixture() })
      );
      expect(createTaskSpy).toHaveBeenCalledWith(userId, task);
    });
  });

  describe('updateAccess', () => {
    it('should return the task with updated relations', () => {
      const mockTask: TaskInterface = new TaskFixture({
        taskGroups: [new TaskGroupFixture()],
        taskStudents: [new TaskStudentFixture()],
        taskClassGroups: [new TaskClassGroupFixture()]
      });
      mockUpdatedAccessResult$ = hot('-a-|', {
        a: mockTask
      });
      const spy = jest.spyOn(taskApi, 'updateAccess');
      expect(
        service.updateAccess(
          1,
          2,
          mockTask.taskGroups,
          mockTask.taskStudents,
          mockTask.taskClassGroups
        )
      ).toBeObservable(
        hot('-a-|', {
          a: mockTask
        })
      );
      expect(spy).toHaveBeenCalledWith(
        2,
        mockTask.taskGroups,
        mockTask.taskStudents,
        mockTask.taskClassGroups
      );
    });
  });
});
