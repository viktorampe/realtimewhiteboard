import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { StudentTasksViewModel } from './student-tasks.viewmodel';

describe('KabasTaskViewModel', () => {
  let studentTasksViewModel: StudentTasksViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [StudentTasksViewModel]
    });
  });

  beforeEach(() => {
    studentTasksViewModel = TestBed.get(StudentTasksViewModel);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(studentTasksViewModel).toBeDefined();
    });
  });
});
