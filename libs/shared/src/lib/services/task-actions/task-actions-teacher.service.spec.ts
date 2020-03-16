import { inject, TestBed } from '@angular/core/testing';
import { TaskFixture } from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { TaskActionsTeacherService } from './task-actions-teacher.service';
import {
  TaskActionsTeacherServiceInterface,
  TeacherTaskOpenerInterface,
  TEACHER_TASK_OPENER_TOKEN
} from './task-actions-teacher.service.interface';

describe('TaskActionsService', () => {
  let taskActionService: TaskActionsTeacherServiceInterface;
  let taskOpener: TeacherTaskOpenerInterface;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TaskActionsTeacherService,
        {
          provide: TEACHER_TASK_OPENER_TOKEN,
          useValue: {
            openTask: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    taskActionService = TestBed.get(TaskActionsTeacherService);
    taskOpener = TestBed.get(TEACHER_TASK_OPENER_TOKEN);
  });

  it('should be created', inject(
    [TaskActionsTeacherService],
    (service: TaskActionsTeacherService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should return openTask action ', () => {
    expect(taskActionService.getActions(new TaskFixture())).toEqual([
      taskActionService.taskActionDictionary.openTask
    ]);
  });
});
