import { inject, TestBed } from '@angular/core/testing';
import { TaskFixture } from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { TaskActionsTeacherService } from './task-actions-teacher.service';
import {
  TaskActionsTeacherServiceInterface,
  TeacherTaskOpenerInterface,
  TEACHER_TASK_OPENER_TOKEN
} from './task-actions-teacher.service.interface';
describe('TaskActionsTeacherService', () => {
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
            openTask: () => {},
            archiveTask: () => {},
            unarchiveTask: () => {},
            openResultsForTask: () => {},
            openLearningPlanGoalMatrixForTask: () => {}
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

  describe('getActions()', () => {
    it('should return actions for digital tasks', () => {
      expect(
        taskActionService.getActions(new TaskFixture({ isPaperTask: false }))
      ).toEqual([
        taskActionService.taskActionDictionary.openTask,
        taskActionService.taskActionDictionary.unarchiveTask,
        taskActionService.taskActionDictionary.openResultsForTask,
        taskActionService.taskActionDictionary.openLearningPlanGoalMatrixForTask
      ]);
    });
    it('should return actions for paper tasks', () => {
      expect(
        taskActionService.getActions(new TaskFixture({ isPaperTask: true }))
      ).toEqual([
        taskActionService.taskActionDictionary.openTask,
        taskActionService.taskActionDictionary.unarchiveTask
      ]);
    });
    it('should return the correct archive action', () => {
      expect(
        taskActionService.getActions(new TaskFixture({ archivedYear: 1999 }))
      ).toContain(taskActionService.taskActionDictionary.unarchiveTask);

      expect(
        taskActionService.getActions(
          new TaskFixture({ archivedYear: undefined })
        )
      ).toContain(taskActionService.taskActionDictionary.archiveTask);
    });
  });
});
