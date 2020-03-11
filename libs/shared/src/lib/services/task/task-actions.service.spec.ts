import { inject, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TaskActionsService } from './task-actions.service';
import {
  TaskActionsServiceInterface,
  TaskOpenerInterface,
  TASK_OPENER_TOKEN
} from './task-actions.service.interface';

describe('TaskActionsService', () => {
  let taskActionService: TaskActionsServiceInterface;
  let taskOpener: TaskOpenerInterface;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TaskActionsService,
        {
          provide: TASK_OPENER_TOKEN,
          useValue: {
            openTask: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    taskActionService = TestBed.get(TaskActionsService);
    taskOpener = TestBed.get(TASK_OPENER_TOKEN);
  });

  it('should be created', inject(
    [TaskActionsService],
    (service: TaskActionsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
