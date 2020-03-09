import { inject, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TaskActionsService } from './task-actions.service';
import { TaskActionsServiceInterface } from './task-actions.service.interface';

describe('TaskActionsService', () => {
  let taskActionService: TaskActionsServiceInterface;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TaskActionsService]
    });
  });

  beforeEach(() => {
    taskActionService = TestBed.get(TaskActionsService);
  });

  it('should be created', inject(
    [TaskActionsService],
    (service: TaskActionsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
