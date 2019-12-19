import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { LearningPlanGoalReducer } from '.';
import { LEARNING_PLAN_GOAL_SERVICE_TOKEN } from '../../learning-plan-goal/learning-plan-goal.service.interface';
import { AddLearningPlanGoalsForBook, LearningPlanGoalsLoadError, LoadLearningPlanGoalsForBook } from './learning-plan-goal.actions';
import { LearningPlanGoalEffects } from './learning-plan-goal.effects';

describe('LearningPlanGoalEffects', () => {
  let actions: Observable<any>;
  let effects: LearningPlanGoalEffects;
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
    service: any = LEARNING_PLAN_GOAL_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = LEARNING_PLAN_GOAL_SERVICE_TOKEN
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
          LearningPlanGoalReducer.NAME,
          LearningPlanGoalReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([LearningPlanGoalEffects])
      ],
      providers: [
        {
          provide: LEARNING_PLAN_GOAL_SERVICE_TOKEN,
          useValue: {
            getLearningPlanGoalsForBook: () => {}
          }
        },
        LearningPlanGoalEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(LearningPlanGoalEffects);
  });

  describe('loadLearningPlanGoal$', () => {
    const loadAction = new LoadLearningPlanGoalsForBook({
      bookId: 1,
      userId: 1
    });
    const filledLoadedAction = new AddLearningPlanGoalsForBook({
      bookId: 1,
      learningPlanGoals: []
    });
    const loadErrorAction = new LearningPlanGoalsLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = LearningPlanGoalReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getLearningPlanGoalsForBook', []);
      });
      it('should trigger an api call with the initialState', () => {
        expectInAndOut(
          effects.loadLearningPlanGoalsForBook$,
          loadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = {
          ...LearningPlanGoalReducer.initialState,
          loadedBooks: { 1: [] }
        };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getLearningPlanGoalsForBook', []);
      });
      it('should not trigger an api call with the loaded state if the book is already loaded', () => {
        expectInNoOut(effects.loadLearningPlanGoalsForBook$, loadAction);
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = LearningPlanGoalReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getLearningPlanGoalsForBook', 'failed');
      });
      it('should return a error action', () => {
        expectInAndOut(
          effects.loadLearningPlanGoalsForBook$,
          loadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      const loadActionForNewBook = new LoadLearningPlanGoalsForBook({
        bookId: 2,
        userId: 1
      });

      beforeAll(() => {
        usedState = {
          ...LearningPlanGoalReducer.initialState,
          loadedBooks: { 1: [] },
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getLearningPlanGoalsForBook', 'failed');
      });
      it('should return nothing if the book is already loaded', () => {
        expectInNoOut(effects.loadLearningPlanGoalsForBook$, loadAction);
      });
      it('should return a error action if the book is not already loaded', () => {
        expectInAndOut(
          effects.loadLearningPlanGoalsForBook$,
          loadActionForNewBook,
          loadErrorAction
        );
      });
    });
  });
});
