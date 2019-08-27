import { TestBed } from '@angular/core/testing';
import {
  DalState,
  EduContentTocQueries,
  EduContentTocReducer,
  getStoreModuleForFeatures
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { take } from 'rxjs/operators';
import { LearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel';

describe('LearningPlanGoalProgressViewModel', () => {
  let lpgpManagementViewModel: LearningPlanGoalProgressManagementViewModel;
  let store: Store<DalState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([EduContentTocReducer])
      ],
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
    it('should call the getLessonsDisplaysForBook selector with the correct props', () => {
      const props = { bookId: 1, learningPlanGoalId: 2 };

      jest.spyOn(EduContentTocQueries, 'getLessonDisplaysForBook');

      lpgpManagementViewModel
        .getMethodLessonsForBook(1, 2)
        .pipe(take(1))
        .subscribe();

      expect(
        EduContentTocQueries.getLessonDisplaysForBook
      ).toHaveBeenCalledWith(
        { eduContentTocs: EduContentTocReducer.initialState },
        props
      );
    });
  });
});
