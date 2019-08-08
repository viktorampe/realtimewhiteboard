import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN } from '../../learning-plan-goal-progress/learning-plan-goal-progress.service.interface';
import { LearningPlanGoalProgressReducer } from '.';
import {
  LearningPlanGoalProgressesLoaded,
  LearningPlanGoalProgressesLoadError,
  LoadLearningPlanGoalProgresses
} from './learning-plan-goal-progress.actions';
import { LearningPlanGoalProgressEffects } from './learning-plan-goal-progress.effects';

describe('LearningPlanGoalProgressEffects', () => {
  let actions: Observable<any>;
  let effects: LearningPlanGoalProgressEffects;
  let usedState: any;

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
            getAllForUser: () => {}
          }
        },
        LearningPlanGoalProgressEffects,
        DataPersistence,
        provideMockActions(() => actions)
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
});
