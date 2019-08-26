import { TestBed } from '@angular/core/testing';
import { DalState, EduContentTocQueries } from '@campus/dal';
import { select, Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { LearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel';

describe('LearningPlanGoalProgressViewModel', () => {
  let lpgpManagementViewModel: LearningPlanGoalProgressManagementViewModel;
  let store: Store<DalState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [Store, LearningPlanGoalProgressManagementViewModel]
    });
  });

  beforeEach(() => {
    lpgpManagementViewModel = TestBed.get(
      LearningPlanGoalProgressManagementViewModel
    );
    store = TestBed.get(Store);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(lpgpManagementViewModel).toBeDefined();
    });
  });

  describe('getMethodLessonsForBook()', () => {
    it('should return the getLessonsDisplaysForBook selector', () => {
      const props = { bookId: 1, learningPlanGoalId: 2 };

      const expected = store.pipe(
        select(EduContentTocQueries.getLessonDisplaysForBook, props)
      );

      const result = lpgpManagementViewModel.getMethodLessonsForBook(1, 2);
      expect(result).toEqual(expected);
    });
  });
});
