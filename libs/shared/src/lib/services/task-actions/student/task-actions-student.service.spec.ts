import { inject, TestBed } from '@angular/core/testing';
import { TaskFixture } from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import {
  StudentTaskOpenerInterface,
  STUDENT_TASK_OPENER_TOKEN,
  TaskActionsStudentService,
  TaskActionsStudentServiceInterface
} from '.';
describe('TaskActionsstudentService', () => {
  let taskActionService: TaskActionsStudentServiceInterface;
  let taskOpener: StudentTaskOpenerInterface;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TaskActionsStudentService,
        {
          provide: STUDENT_TASK_OPENER_TOKEN,
          useValue: {
            openTask: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    taskActionService = TestBed.get(TaskActionsStudentService);
    taskOpener = TestBed.get(STUDENT_TASK_OPENER_TOKEN);
  });

  it('should be created', inject(
    [TaskActionsStudentService],
    (service: TaskActionsStudentService) => {
      expect(service).toBeTruthy();
    }
  ));

  describe('getActions()', () => {
    it('should return actions for tasks', () => {
      expect(taskActionService.getActions(new TaskFixture())).toEqual([
        taskActionService.taskActionDictionary.openTask
      ]);
    });
  });
});
