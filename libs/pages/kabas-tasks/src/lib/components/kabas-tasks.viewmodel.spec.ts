import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TaskStatusEnum } from '../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from './kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from './kabas-tasks.viewmodel.mock';

describe('KabasTaskViewModel', () => {
  let kabasTasksViewModel: KabasTasksViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: []
    });
  });

  beforeEach(() => {
    kabasTasksViewModel = TestBed.get(MockKabasTasksViewModel);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(kabasTasksViewModel).toBeDefined();
    });
  });
});
