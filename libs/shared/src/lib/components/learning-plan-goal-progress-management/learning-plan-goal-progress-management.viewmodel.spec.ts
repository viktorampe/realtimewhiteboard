import { TestBed } from '@angular/core/testing';
import {
  DalState,
  EduContentTocQueries,
  EduContentTocReducer,
  getStoreModuleForFeatures,
  LearningPlanGoalProgressActions,
  PersonFixture,
  UserLessonActions,
  UserLessonQueries,
  UserLessonReducer,
  UserQueries,
  UserReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { LearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel';

describe('LearningPlanGoalProgressViewModel', () => {
  let lpgpManagementViewModel: LearningPlanGoalProgressManagementViewModel;
  let store: Store<DalState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([
          EduContentTocReducer,
          UserReducer,
          UserLessonReducer
        ])
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
    it('should call the getLessonsDisplaysForBook selector with the correct props and return the result', () => {
      const props = { bookId: 1, learningPlanGoalId: 2 };
      const mockResults = [{ eduContentTocId: 1, values: ['foo'] }];

      const storeState = {
        eduContentTocs: EduContentTocReducer.initialState,
        user: UserReducer.initialState,
        userLessons: UserLessonReducer.initialState
      };

      jest
        .spyOn(EduContentTocQueries, 'getLessonDisplaysForBook')
        .mockReturnValue(mockResults);

      const returnValue = lpgpManagementViewModel.getMethodLessonsForBook(1, 2);

      // assertion order matters: toBeObservable subscribes to the observable returned from getMethodLessonsForBook(),
      // which also triggers the selector (needed for the assertion below)
      expect(returnValue).toBeObservable(hot('a', { a: mockResults }));

      // only works when there is a subscriber
      expect(
        EduContentTocQueries.getLessonDisplaysForBook
      ).toHaveBeenCalledWith(storeState, props);
    });
  });

  describe('createLearningPlanGoalProgressForEduContentTOCs', () => {
    const userId = 1;
    const classGroupId = 2;
    const learningPlanGoalId = 3;
    const eduContentTocIds = [4, 5];
    const eduContentBookId = 6;

    beforeEach(() => {
      jest
        .spyOn(UserQueries, 'getCurrentUser')
        .mockReturnValue(new PersonFixture({ id: userId }));
    });

    it('should dispatch an action', () => {
      store.dispatch = jest.fn();

      lpgpManagementViewModel.createLearningPlanGoalProgressForEduContentTOCs(
        learningPlanGoalId,
        classGroupId,
        eduContentTocIds,
        eduContentBookId
      );

      const expectedAction = new LearningPlanGoalProgressActions.StartAddManyLearningPlanGoalProgresses(
        {
          personId: userId,
          learningPlanGoalProgresses: [
            {
              classGroupId,
              learningPlanGoalId,
              eduContentTOCId: eduContentTocIds[0],
              eduContentBookId
            },
            {
              classGroupId,
              learningPlanGoalId,
              eduContentTOCId: eduContentTocIds[1],
              eduContentBookId
            }
          ]
        }
      );

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('createLearningPlanGoalProgressForUserLesson', () => {
    const userId = 185;
    const classGroupId = 2;
    const learningPlanGoalId = 3;
    const eduContentBookId = 6;
    const userLessonId = 7;
    const description = 'blah';

    beforeEach(() => {
      jest
        .spyOn(UserQueries, 'getCurrentUser')
        .mockReturnValue(new PersonFixture({ id: userId }));

      jest
        .spyOn(UserLessonQueries, 'getAll')
        .mockReturnValue([{ id: userLessonId, description, personId: userId }]);
    });

    it('should dispatch an action, create (different description)', () => {
      store.dispatch = jest.fn();

      lpgpManagementViewModel.createLearningPlanGoalProgressForUserLesson(
        learningPlanGoalId,
        classGroupId,
        'not ' + description,
        eduContentBookId
      );

      const expectedAction = new UserLessonActions.CreateUserLessonWithLearningPlanGoalProgresses(
        {
          userId,
          userLesson: { description: 'not ' + description },
          learningPlanGoalProgresses: [
            {
              classGroupId,
              learningPlanGoalId,
              eduContentBookId
            }
          ]
        }
      );

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch an action, create (different personId)', () => {
      store.dispatch = jest.fn();

      jest
        .spyOn(UserLessonQueries, 'getAll')
        .mockReturnValue([
          { id: userLessonId, description, personId: userId + 1 }
        ]);

      lpgpManagementViewModel.createLearningPlanGoalProgressForUserLesson(
        learningPlanGoalId,
        classGroupId,
        description,
        eduContentBookId
      );

      const expectedAction = new UserLessonActions.CreateUserLessonWithLearningPlanGoalProgresses(
        {
          userId,
          userLesson: { description },
          learningPlanGoalProgresses: [
            {
              classGroupId,
              learningPlanGoalId,
              eduContentBookId
            }
          ]
        }
      );

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch an action, use existing', () => {
      store.dispatch = jest.fn();

      lpgpManagementViewModel.createLearningPlanGoalProgressForUserLesson(
        learningPlanGoalId,
        classGroupId,
        description,
        eduContentBookId
      );

      const expectedAction = new LearningPlanGoalProgressActions.StartAddManyLearningPlanGoalProgresses(
        {
          personId: userId,
          learningPlanGoalProgresses: [
            {
              classGroupId,
              learningPlanGoalId,
              userLessonId,
              eduContentBookId
            }
          ]
        }
      );

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
