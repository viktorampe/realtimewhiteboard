import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { cold, hot } from '@nrwl/nx/testing';
import { undo } from 'ngrx-undo';
import { Observable, of } from 'rxjs';
import { LearningPlanGoalProgressReducer } from '.';
import { LearningPlanGoalProgressFixture } from '../../+fixtures';
import {
  LearningPlanGoalProgressServiceInterface,
  LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
} from '../../learning-plan-goal-progress/learning-plan-goal-progress.service.interface';
import { UndoService, UNDO_SERVICE_TOKEN } from '../../undo';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import {
  AddLearningPlanGoalProgresses,
  BulkAddLearningPlanGoalProgresses,
  DeleteLearningPlanGoalProgress,
  DeleteLearningPlanGoalProgresses,
  LearningPlanGoalProgressesLoaded,
  LearningPlanGoalProgressesLoadError,
  LoadLearningPlanGoalProgresses,
  StartAddLearningPlanGoalProgresses,
  ToggleLearningPlanGoalProgress
} from './learning-plan-goal-progress.actions';
import { LearningPlanGoalProgressEffects } from './learning-plan-goal-progress.effects';

describe('LearningPlanGoalProgressEffects', () => {
  let actions: Observable<any>;
  let effects: LearningPlanGoalProgressEffects;
  let undoService: UndoService;
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
            createLearningPlanGoalProgress: () => {},
            deleteLearningPlanGoalProgresses: () => {},
            deleteLearningPlanGoalProgress: () => {}
          }
        },
        {
          provide: UNDO_SERVICE_TOKEN,
          useClass: UndoService
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
    undoService = TestBed.get(UNDO_SERVICE_TOKEN);
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
      learningPlanGoalIds: [1, 2],
      eduContentBookId: 1699729494
    };

    let learningPlanGoalProgressService: LearningPlanGoalProgressServiceInterface;

    beforeEach(() => {
      learningPlanGoalProgressService = TestBed.get(
        LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
      );
    });

    it('should make the service call and return an action, for eduContentTOCId', () => {
      const eduContentTOCId = 1;
      const userLessonId = undefined;

      const startAddAction = new StartAddLearningPlanGoalProgresses({
        ...staticParams,
        eduContentTOCId
      });

      const returnedValues = staticParams.learningPlanGoalIds.map(
        learningPlanGoalId => ({
          personId: staticParams.personId,
          classGroupId: staticParams.classGroupId,
          eduContentBookId: staticParams.eduContentBookId,
          learningPlanGoalId,
          eduContentTOCId
        })
      );

      jest
        .spyOn(
          learningPlanGoalProgressService,
          'createLearningPlanGoalProgress'
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
        learningPlanGoalProgressService.createLearningPlanGoalProgress
      ).toHaveBeenCalledWith(
        staticParams.personId,
        staticParams.classGroupId,
        staticParams.learningPlanGoalIds,
        staticParams.eduContentBookId,
        userLessonId,
        eduContentTOCId
      );
    });

    it('should make the service call and return an action, for userLessonId', () => {
      const eduContentTOCId = undefined;
      const userLessonId = 1;

      const startAddAction = new StartAddLearningPlanGoalProgresses({
        ...staticParams,
        userLessonId
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
          'createLearningPlanGoalProgress'
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
        learningPlanGoalProgressService.createLearningPlanGoalProgress
      ).toHaveBeenCalledWith(
        staticParams.personId,
        staticParams.classGroupId,
        staticParams.learningPlanGoalIds,
        staticParams.eduContentBookId,
        userLessonId,
        eduContentTOCId
      );
    });

    it('should return a feedbackAction if an error occured', () => {
      // no eduContentId or UserLessonId -> will error
      const startAddAction = new StartAddLearningPlanGoalProgresses({
        ...staticParams
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

  describe('deleteLearningPlanGoalProgress', () => {
    const learningPlanGoalProgressId = 1;
    const userId = 1;

    const deleteAction = new DeleteLearningPlanGoalProgress({
      id: learningPlanGoalProgressId,
      userId
    });

    let learningPlanGoalProgressService: LearningPlanGoalProgressServiceInterface;

    beforeEach(() => {
      learningPlanGoalProgressService = TestBed.get(
        LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
      );
    });

    it('should make the service call', () => {
      jest
        .spyOn(
          learningPlanGoalProgressService,
          'deleteLearningPlanGoalProgress'
        )
        .mockReturnValue(of(true));

      actions = hot('a', { a: deleteAction });

      expect(effects.deleteLearningPlanGoalProgress$).toBeObservable(
        cold('a', {
          a: new EffectFeedbackActions.AddEffectFeedback({
            effectFeedback: EffectFeedback.generateSuccessFeedback(
              uuid,
              deleteAction,
              'Leerplandoelvoortgang verwijderd.'
            )
          })
        })
      );

      expect(
        learningPlanGoalProgressService.deleteLearningPlanGoalProgress
      ).toHaveBeenCalledWith(userId, learningPlanGoalProgressId);
    });

    it('should return an undoAction and a feedBackAction on error', () => {
      jest
        .spyOn(
          learningPlanGoalProgressService,
          'deleteLearningPlanGoalProgress'
        )
        .mockImplementation(() => {
          throw new Error('error');
        });

      actions = hot('a', { a: deleteAction });

      const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: new EffectFeedback({
          id: uuid,
          triggerAction: deleteAction,
          message:
            'Het is niet gelukt om de status van het leerplandoel aan te passen.',
          userActions: [
            { title: 'Opnieuw proberen', userAction: deleteAction }
          ],
          type: 'error',
          priority: Priority.HIGH
        })
      });

      expect(effects.deleteLearningPlanGoalProgress$).toBeObservable(
        cold('(ab)', {
          a: undo(deleteAction),
          b: feedbackAction
        })
      );
    });
  });

  describe('deleteLearningPlanGoalProgresses', () => {
    const learningPlanGoalProgressIds = [1, 2];
    const userId = 1;

    const deleteAction = new DeleteLearningPlanGoalProgresses({
      ids: learningPlanGoalProgressIds,
      userId
    });

    let learningPlanGoalProgressService: LearningPlanGoalProgressServiceInterface;

    beforeEach(() => {
      learningPlanGoalProgressService = TestBed.get(
        LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
      );
    });

    it('should make the service call', () => {
      jest
        .spyOn(
          learningPlanGoalProgressService,
          'deleteLearningPlanGoalProgresses'
        )
        .mockReturnValue(of(true));

      const dummyAction = {
        type: 'some action',
        payload: { userId: 317646491, ids: [612837505, 892853336] }
      };
      const undoSpy = jest
        .spyOn(undoService, 'dispatchActionAsUndoable')
        .mockReturnValue(of(dummyAction));

      actions = hot('a', { a: deleteAction });

      expect(effects.deleteLearningPlanGoalProgresses$).toBeObservable(
        cold('a', {
          a: dummyAction
        })
      );

      expect(undoSpy).toHaveBeenCalledTimes(1);
      expect(
        learningPlanGoalProgressService.deleteLearningPlanGoalProgresses
      ).toHaveBeenCalledWith(userId, learningPlanGoalProgressIds);
    });

    it('should return an undoAction and a feedBackAction on error', () => {
      jest
        .spyOn(
          learningPlanGoalProgressService,
          'deleteLearningPlanGoalProgresses'
        )
        .mockImplementation(() => {
          throw new Error('error');
        });

      actions = hot('a', { a: deleteAction });

      const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: new EffectFeedback({
          id: uuid,
          triggerAction: deleteAction,
          message:
            'Het is niet gelukt om de status van het leerplandoelen aan te passen.',
          userActions: [
            { title: 'Opnieuw proberen', userAction: deleteAction }
          ],
          type: 'error',
          priority: Priority.HIGH
        })
      });

      expect(effects.deleteLearningPlanGoalProgresses$).toBeObservable(
        cold('(ab)', {
          a: undo(deleteAction),
          b: feedbackAction
        })
      );
    });
  });

  describe('bulkAddLearningPlanGoalProgress', () => {
    const personId = 1;
    const classGroupId = 1;
    const eduContentTOCId = 1;
    const userLessonId = 1;
    const eduContentBookId = 1790506026;
    const learningPlanGoalIds = [1, 2]; // 1 is already in state, 2 isn't

    beforeAll(() => {
      usedState = {
        ...LearningPlanGoalProgressReducer.initialState,
        ids: [1],
        entities: {
          1: new LearningPlanGoalProgressFixture({
            eduContentBookId: eduContentBookId
          })
        }
      };
    });

    let learningPlanGoalProgressService;
    beforeEach(() => {
      learningPlanGoalProgressService = TestBed.get(
        LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
      );
    });

    it('should return a StartAddLearningPlanGoalProgresses action, for eduContentTOCId', () => {
      const bulkAddAction = new BulkAddLearningPlanGoalProgresses({
        personId,
        classGroupId,
        eduContentTOCId,
        learningPlanGoalIds,
        eduContentBookId
      });

      actions = hot('a', {
        a: bulkAddAction
      });

      const expectedAction = new StartAddLearningPlanGoalProgresses({
        personId,
        classGroupId,
        eduContentTOCId,
        userLessonId: undefined,
        learningPlanGoalIds: [2],
        eduContentBookId
      });

      expect(effects.bulkAddLearningPlanGoalProgress$).toBeObservable(
        hot('a', { a: expectedAction })
      );
    });

    it('should return a StartAddLearningPlanGoalProgresses action, for userLessonId', () => {
      const bulkAddAction = new BulkAddLearningPlanGoalProgresses({
        personId,
        classGroupId,
        userLessonId,
        learningPlanGoalIds,
        eduContentBookId
      });

      actions = hot('a', {
        a: bulkAddAction
      });

      const expectedAction = new StartAddLearningPlanGoalProgresses({
        classGroupId,
        eduContentTOCId: undefined,
        userLessonId,
        learningPlanGoalIds: [2],
        personId,
        eduContentBookId
      });

      expect(effects.bulkAddLearningPlanGoalProgress$).toBeObservable(
        hot('a', { a: expectedAction })
      );
    });
  });

  describe('toggleLearningPlanGoalProgress', () => {
    const personId = 1;
    const classGroupId = 1;
    const eduContentTOCId = 1;
    const userLessonId = 1;
    const eduContentBookId = 571253002;

    const learningPlanGoalIds = [1, 2]; // 1 is already in state, 2 isn't

    beforeAll(() => {
      usedState = {
        ...LearningPlanGoalProgressReducer.initialState,
        ids: [1],
        entities: {
          1: new LearningPlanGoalProgressFixture({
            eduContentBookId: eduContentBookId
          })
        }
      };
    });

    let learningPlanGoalProgressService;
    beforeEach(() => {
      learningPlanGoalProgressService = TestBed.get(
        LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
      );
    });

    it('should return an StartAddLearningPlanGoalProgresses action if the progress does not exist, for EduContentTOC', () => {
      const toggleAction = new ToggleLearningPlanGoalProgress({
        classGroupId,
        personId,
        learningPlanGoalId: 2,
        eduContentTOCId,
        eduContentBookId
      });

      actions = hot('a', { a: toggleAction });

      const expectedAction = new StartAddLearningPlanGoalProgresses({
        classGroupId,
        learningPlanGoalIds: [2],
        eduContentTOCId,
        personId,
        eduContentBookId
      });

      expect(effects.toggleLearningPlanGoalProgress$).toBeObservable(
        hot('a', { a: expectedAction })
      );
    });

    it('should return a DeleteLearningPlanGoalProgress action if the progress exists, for EduContentTOC', () => {
      const toggleAction = new ToggleLearningPlanGoalProgress({
        classGroupId,
        personId,
        learningPlanGoalId: 1,
        eduContentTOCId,
        eduContentBookId
      });

      actions = hot('a', { a: toggleAction });

      const expectedAction = new DeleteLearningPlanGoalProgress({
        id: 1,
        userId: personId
      });

      expect(effects.toggleLearningPlanGoalProgress$).toBeObservable(
        hot('a', { a: expectedAction })
      );
    });

    it('should return an StartAddLearningPlanGoalProgresses action if the progress does not exist, for UserLesson', () => {
      const toggleAction = new ToggleLearningPlanGoalProgress({
        classGroupId,
        personId,
        learningPlanGoalId: 2,
        userLessonId,
        eduContentBookId
      });

      actions = hot('a', { a: toggleAction });

      const expectedAction = new StartAddLearningPlanGoalProgresses({
        classGroupId,
        learningPlanGoalIds: [2],
        userLessonId,
        personId,
        eduContentBookId
      });

      expect(effects.toggleLearningPlanGoalProgress$).toBeObservable(
        hot('a', { a: expectedAction })
      );
    });

    it('should return a DeleteLearningPlanGoalProgress action if the progress exists, for UserLesson', () => {
      const toggleAction = new ToggleLearningPlanGoalProgress({
        classGroupId,
        personId,
        learningPlanGoalId: 1,
        userLessonId,
        eduContentBookId
      });

      actions = hot('a', { a: toggleAction });

      const expectedAction = new DeleteLearningPlanGoalProgress({
        id: 1,
        userId: personId
      });

      expect(effects.toggleLearningPlanGoalProgress$).toBeObservable(
        hot('a', { a: expectedAction })
      );
    });
  });
});
