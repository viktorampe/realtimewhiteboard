import { TestBed } from '@angular/core/testing';
import {
  DalState,
  EduContentTocReducer,
  getStoreModuleForFeatures
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
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
    it('should return the getLessonsDisplaysForBook selector', () => {
      const props = { bookId: 1, learningPlanGoalId: 2 };
      // jest.spyOn(getLessonDisplaysForBook, 'projector');

      // EduContentTocQueries.getLessonDisplaysForBook.projector = jest
      //   .fn()
      //   .mockReturnValue('foo');
      // const expected = store.pipe(select(getLessonDisplaysForBook, props));

      lpgpManagementViewModel
        .getMethodLessonsForBook(1, 2)
        .subscribe(console.log);
      // expect(
      //   EduContentTocQueries.getLessonDisplaysForBook.projector
      // ).toHaveBeenCalled();
      // expect(result).toBeObservable();
    });
  });
});
