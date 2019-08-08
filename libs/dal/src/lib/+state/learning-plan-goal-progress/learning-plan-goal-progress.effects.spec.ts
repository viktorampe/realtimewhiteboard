import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { cold, hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { LearningPlanGoalProgressReducer } from '.';
import {
  LearningPlanGoalProgressServiceInterface,
  LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
} from '../../learning-plan-goal-progress/learning-plan-goal-progress.service.interface';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import {
  AddLearningPlanGoalProgresses,
  LearningPlanGoalProgressesLoaded,
  LearningPlanGoalProgressesLoadError,
  LoadLearningPlanGoalProgresses,
  StartAddLearningPlanGoalProgresses
} from './learning-plan-goal-progress.actions';
import { LearningPlanGoalProgressEffects } from './learning-plan-goal-progress.effects';

describe('LearningPlanGoalProgressEffects', () => {
  let actions: Observable<any>;
  let effects: LearningPlanGoalProgressEffects;
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
    service: any = LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockImplementation(() => {
      throw new Error(errorMessage);
    });
  };

  beforeAll(() => {
    mockDate = new MockDate();
  });

  afterAll(() => {
    mockDate.returnRealDate();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          LearningPlanGoalProgressReducer.NAME,
          LearningPlanGoalProgressReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([LearningPlanGoalProgressEffects])
      ],
      providers: [
        {
          provide: LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            createLearningPlanGoalProgressForEduContentTOC: () => {},
            createLearningPlanGoalProgressForUserLesson: () => {}
          }
        },
        LearningPlanGoalProgressEffects,
        DataPersistence,
        provideMockActions(() => actions),
        {
          provide: 'uuid',
          useValue: () => uuid
        }
      ]
    });

    effects = TestBed.get(LearningPlanGoalProgressEffects);
  });

  describe('loadLearningPlanGoalProgress$', () => {
    const unforcedLoadAction = new LoadLearningPlanGoalProgresses({
      userId: 1
    });
    const forcedLoadAction = new LoadLearningPlanGoalProgresses({
      force: true,
      userId: 1
    });
    const filledLoadedAction = new LearningPlanGoalProgressesLoaded({
      learningPlanGoalProgresses: []
    });
    const loadErrorAction = new LearningPlanGoalProgressesLoadError(
      new Error('failed')
    );
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = LearningPlanGoalProgressReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadLearningPlanGoalProgresses$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadLearningPlanGoalProgresses$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = {
          ...LearningPlanGoalProgressReducer.initialState,
          loaded: true
        };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(
          effects.loadLearningPlanGoalProgresses$,
          unforcedLoadAction
        );
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadLearningPlanGoalProgresses$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = LearningPlanGoalProgressReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadLearningPlanGoalProgresses$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadLearningPlanGoalProgresses$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...LearningPlanGoalProgressReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(
          effects.loadLearningPlanGoalProgresses$,
          unforcedLoadAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadLearningPlanGoalProgresses$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });

  describe('startAddLearningPlanGoalProgresses', () => {
    const staticParams = {
      personId: 1,
      classGroupId: 1,
      learningPlanGoalIds: [1, 2]
    };

    let learningPlanGoalProgressService: LearningPlanGoalProgressServiceInterface;

    beforeEach(() => {
      learningPlanGoalProgressService = TestBed.get(
        LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
      );
    });

    it('should make the service call and return an action, for eduContentTOCId', () => {
      const eduContentTOCId = 1;

      const startAddAction = new StartAddLearningPlanGoalProgresses({
        learningPlanGoalProgresses: { ...staticParams, eduContentTOCId },
        userId: staticParams.personId
      });

      const returnedValues = staticParams.learningPlanGoalIds.map(
        learningPlanGoalId => ({
          personId: staticParams.personId,
          classGroupId: staticParams.classGroupId,
          learningPlanGoalId,
          eduContentTOCId
        })
      );

      jest
        .spyOn(
          learningPlanGoalProgressService,
          'createLearningPlanGoalProgressForEduContentTOC'
        )
        .mockReturnValue(of(returnedValues));

      actions = hot('a', { a: startAddAction });

      expect(effects.startAddLearningPlanGoalProgresses$).toBeObservable(
        cold('a', {
          a: new AddLearningPlanGoalProgresses({
            learningPlanGoalProgresses: returnedValues
          })
        })
      );

      expect(
        learningPlanGoalProgressService.createLearningPlanGoalProgressForEduContentTOC
      ).toHaveBeenCalledWith(
        staticParams.personId,
        staticParams.classGroupId,
        eduContentTOCId,
        staticParams.learningPlanGoalIds
      );
    });

    it('should make the service call and return an action, for userLessonId', () => {
      const userLessonId = 1;

      const startAddAction = new StartAddLearningPlanGoalProgresses({
        learningPlanGoalProgresses: { ...staticParams, userLessonId },
        userId: staticParams.personId
      });

      const returnedValues = staticParams.learningPlanGoalIds.map(
        learningPlanGoalId => ({
          personId: staticParams.personId,
          classGroupId: staticParams.classGroupId,
          learningPlanGoalId,
          userLessonId
        })
      );

      jest
        .spyOn(
          learningPlanGoalProgressService,
          'createLearningPlanGoalProgressForUserLesson'
        )
        .mockReturnValue(of(returnedValues));

      actions = hot('a', { a: startAddAction });

      expect(effects.startAddLearningPlanGoalProgresses$).toBeObservable(
        cold('a', {
          a: new AddLearningPlanGoalProgresses({
            learningPlanGoalProgresses: returnedValues
          })
        })
      );

      expect(
        learningPlanGoalProgressService.createLearningPlanGoalProgressForUserLesson
      ).toHaveBeenCalledWith(
        staticParams.personId,
        staticParams.classGroupId,
        userLessonId,
        staticParams.learningPlanGoalIds
      );
    });

    it('should return a feedbackAction if an error occured', () => {
      // no eduContentId or UserLessonId -> will error
      const startAddAction = new StartAddLearningPlanGoalProgresses({
        learningPlanGoalProgresses: { ...staticParams },
        userId: staticParams.personId
      });

      actions = hot('a', { a: startAddAction });

      const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: new EffectFeedback({
          id: uuid,
          triggerAction: startAddAction,
          message:
            'Het is niet gelukt om de status van het leerplandoel aan te passen.',
          userActions: [
            { title: 'Opnieuw proberen', userAction: startAddAction }
          ],
          type: 'error',
          priority: Priority.HIGH
        })
      });

      expect(effects.startAddLearningPlanGoalProgresses$).toBeObservable(
        hot('a', {
          a: feedbackAction
        })
      );
    });
  });
});
