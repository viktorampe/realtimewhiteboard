import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { UserLessonReducer } from '.';
import { UserLessonFixture } from '../../+fixtures';
import { USER_LESSON_SERVICE_TOKEN } from '../../user-lesson/user-lesson.service.interface';
import { EffectFeedback, EffectFeedbackActions, Priority } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import { StartAddManyLearningPlanGoalProgresses } from '../learning-plan-goal-progress/learning-plan-goal-progress.actions';
import { AddUserLesson, CreateUserLesson, CreateUserLessonWithLearningPlanGoalProgresses, LoadUserLessons, UserLessonsLoaded, UserLessonsLoadError } from './user-lesson.actions';
import { UserLessonEffects } from './user-lesson.effects';

describe('UserLessonEffects', () => {
  let actions: Observable<any>;
  let effects: UserLessonEffects;
  let usedState: any;

  const uuid = 'foo';
  let mockDate: MockDate;

  const expectInAndOut = (
    effect: Observable<any>,
    triggerAction: Action,
    effectOutput: any
  ) => {
    actions = hot('-a-|', { a: triggerAction });
    expect(effect).toBeObservable(
      hot('-a-|', {
        a: effectOutput
      })
    );
  };

  const expectInNoOut = (effect: Observable<any>, triggerAction: Action) => {
    actions = hot('-a-|', { a: triggerAction });
    expect(effect).toBeObservable(hot('---|'));
  };

  const mockServiceMethodReturnValue = (
    method: string,
    returnValue: any,
    service: any = USER_LESSON_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = USER_LESSON_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockImplementation(() => {
      throw new Error(errorMessage);
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
                StoreModule.forRoot({},{
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false
          }}),
        StoreModule.forFeature(
          UserLessonReducer.NAME,
          UserLessonReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([UserLessonEffects])
      ],
      providers: [
        {
          provide: USER_LESSON_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            createForUser: () => {}
          }
        },
        UserLessonEffects,
        DataPersistence,
        provideMockActions(() => actions),
        {
          provide: 'uuid',
          useValue: () => uuid
        }
      ]
    });

    effects = TestBed.get(UserLessonEffects);
  });

  beforeAll(() => {
    mockDate = new MockDate();
  });

  afterAll(() => {
    mockDate.returnRealDate();
  });

  describe('loadUserLesson$', () => {
    const unforcedLoadAction = new LoadUserLessons({ userId: 1 });
    const forcedLoadAction = new LoadUserLessons({ force: true, userId: 1 });
    const filledLoadedAction = new UserLessonsLoaded({ userLessons: [] });
    const loadErrorAction = new UserLessonsLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = UserLessonReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadUserLessons$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadUserLessons$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...UserLessonReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadUserLessons$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadUserLessons$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = UserLessonReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadUserLessons$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUserLessons$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...UserLessonReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadUserLessons$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUserLessons$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });

  describe('createUserLesson$', () => {
    const userId = 1;
    const userLesson = new UserLessonFixture({
      id: undefined,
      description: 'dit is een nieuwe userLesson',
      personId: userId
    });

    let effectFeedback: EffectFeedback;
    let addFeedbackAction: EffectFeedbackActions.AddEffectFeedback;

    const createUserLessonAction = new CreateUserLesson({
      userId,
      userLesson
    });

    describe('when successful', () => {
      const addUserLessonAction = new AddUserLesson({
        userLesson
      });

      beforeAll(() => {
        effectFeedback = new EffectFeedback({
          id: uuid,
          triggerAction: createUserLessonAction,
          message: 'Les "dit is een nieuwe userLesson" toegevoegd.'
        });
        addFeedbackAction = new AddEffectFeedback({ effectFeedback });
      });

      beforeEach(() => {
        mockServiceMethodReturnValue('createForUser', userLesson);
      });

      it('should dispatch an addUserLessonAction action', () => {
        actions = hot('a', {
          a: createUserLessonAction
        });

        expect(effects.createUserLesson$).toBeObservable(
          hot('(ab)', {
            a: addUserLessonAction,
            b: addFeedbackAction
          })
        );
      });
    });

    describe('when errored', () => {
      beforeAll(() => {
        effectFeedback = new EffectFeedback({
          id: uuid,
          triggerAction: createUserLessonAction,
          message:
            'Het is niet gelukt om les "dit is een nieuwe userLesson" toe te voegen.',
          type: 'error',
          userActions: [
            { title: 'Opnieuw proberen', userAction: createUserLessonAction }
          ],
          priority: Priority.HIGH
        });
        addFeedbackAction = new AddEffectFeedback({ effectFeedback });
      });

      beforeEach(() => {
        mockServiceMethodError('createForUser', 'Something went wrong');
      });

      it('should dispatch an error feedback action', () => {
        expectInAndOut(
          effects.createUserLesson$,
          createUserLessonAction,
          addFeedbackAction
        );
      });
    });
  });

  describe('createUserLessonWithLearningPlanGoalProgresses$', () => {
    const userId = 1;
    const classGroupId = 2;
    const learningPlanGoalId = 3;
    const eduContentBookId = 4;
    const userLessonId = 5;

    const userLesson = new UserLessonFixture({
      id: undefined,
      description: 'dit is een nieuwe userLesson',
      personId: userId
    });

    const returnedUserLesson = new UserLessonFixture({
      id: userLessonId,
      description: 'dit is een nieuwe userLesson',
      personId: userId
    });

    const lpgpsToCreate = [
      {
        classGroupId,
        learningPlanGoalId,
        eduContentBookId
      }
    ];

    let effectFeedback: EffectFeedback;
    let addFeedbackAction: EffectFeedbackActions.AddEffectFeedback;

    const createUserLessonWithLearningPlanGoalProgressesAction = new CreateUserLessonWithLearningPlanGoalProgresses(
      {
        userId,
        userLesson,
        learningPlanGoalProgresses: lpgpsToCreate
      }
    );

    describe('when successful', () => {
      const addUserLessonAction = new AddUserLesson({
        userLesson: returnedUserLesson
      });
      const startAddManyLearningPlanGoalProgressesAction = new StartAddManyLearningPlanGoalProgresses(
        {
          personId: userId,
          learningPlanGoalProgresses: [
            {
              userLessonId,
              classGroupId,
              learningPlanGoalId,
              eduContentBookId
            }
          ]
        }
      );

      beforeAll(() => {
        effectFeedback = new EffectFeedback({
          id: uuid,
          triggerAction: createUserLessonWithLearningPlanGoalProgressesAction,
          message: 'Les "dit is een nieuwe userLesson" toegevoegd.'
        });
        addFeedbackAction = new AddEffectFeedback({ effectFeedback });
      });

      beforeEach(() => {
        mockServiceMethodReturnValue('createForUser', returnedUserLesson);
      });

      it('should dispatch an addUserLessonAction action and a startAddManyLearningPlanGoalProgresses action', () => {
        actions = hot('a', {
          a: createUserLessonWithLearningPlanGoalProgressesAction
        });

        expect(
          effects.createUserLessonWithLearningPlanGoalProgresses$
        ).toBeObservable(
          hot('(abc)', {
            a: addUserLessonAction,
            b: startAddManyLearningPlanGoalProgressesAction,
            c: addFeedbackAction
          })
        );
      });
    });

    describe('when errored', () => {
      beforeAll(() => {
        effectFeedback = new EffectFeedback({
          id: uuid,
          triggerAction: createUserLessonWithLearningPlanGoalProgressesAction,
          message:
            'Het is niet gelukt om les "dit is een nieuwe userLesson" toe te voegen.',
          type: 'error',
          userActions: [
            {
              title: 'Opnieuw proberen',
              userAction: createUserLessonWithLearningPlanGoalProgressesAction
            }
          ],
          priority: Priority.HIGH
        });
        addFeedbackAction = new AddEffectFeedback({ effectFeedback });
      });

      beforeEach(() => {
        mockServiceMethodError('createForUser', 'Something went wrong');
      });

      it('should dispatch an error feedback action', () => {
        expectInAndOut(
          effects.createUserLessonWithLearningPlanGoalProgresses$,
          createUserLessonWithLearningPlanGoalProgressesAction,
          addFeedbackAction
        );
      });
    });
  });
});
