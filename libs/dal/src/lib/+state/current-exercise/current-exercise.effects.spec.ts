import { TestBed } from '@angular/core/testing';
import { DalActions, ExerciseInterface } from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { ExerciseReducer } from '.';
import { EXERCISE_SERVICE_TOKEN } from '../../exercise/exercise.service.interface';
import {
  CurrentExerciseError,
  CurrentExerciseLoaded,
  SaveCurrentExercise,
  StartExercise
} from './current-exercise.actions';
import { ExerciseEffects } from './current-exercise.effects';

describe('ExerciseEffects', () => {
  let actions: Observable<any>;
  let effects: ExerciseEffects;
  let usedState: any;
  let mockExercise: ExerciseInterface;

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
    service: any = EXERCISE_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = EXERCISE_SERVICE_TOKEN
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
        StoreModule.forFeature(ExerciseReducer.NAME, ExerciseReducer.reducer, {
          initialState: usedState
        }),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([ExerciseEffects])
      ],
      providers: [
        {
          provide: EXERCISE_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            startExercise: () => mockExercise,
            saveExercise: () => mockExercise
          }
        },
        ExerciseEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(ExerciseEffects);
  });

  describe('startExercise$', () => {
    mockExercise = {
      eduContent: undefined,
      cmiMode: 'normal',
      result: undefined,
      saveToApi: true,
      url: 'dit is een url'
    };

    const startTaskExerciseAction = new StartExercise({
      userId: 6,
      educontentId: 1,
      taskId: 1
    });
    const startUnlockedContentExerciseAction = new StartExercise({
      userId: 6,
      educontentId: 1,
      unlockedContentId: 1
    });
    const filledLoadedAction = new CurrentExerciseLoaded(mockExercise);
    const loadErrorAction = new CurrentExerciseError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = ExerciseReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('startExercise', mockExercise);
      });
      it('should trigger an api call with the initialState for a task', () => {
        expectInAndOut(
          effects.startExercise$,
          startTaskExerciseAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState for an unlockedContent', () => {
        expectInAndOut(
          effects.startExercise$,
          startUnlockedContentExerciseAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...ExerciseReducer.initialState, loaded: true };
        mockExercise = {
          eduContent: undefined,
          cmiMode: 'normal',
          result: undefined,
          saveToApi: true,
          url: 'dit is een url'
        };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('startExercise', mockExercise);
      });
      it('should trigger an api call with the with the loaded state for a task', () => {
        expectInAndOut(
          effects.startExercise$,
          startTaskExerciseAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the with the loaded state for an unlockedContent', () => {
        expectInAndOut(
          effects.startExercise$,
          startUnlockedContentExerciseAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = ExerciseReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('startExercise', 'failed');
      });
      it('should return a error action ', () => {
        expectInAndOut(
          effects.startExercise$,
          startTaskExerciseAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...ExerciseReducer.initialState,
          loaded: true
        };
      });
      beforeEach(() => {
        mockServiceMethodError('startExercise', 'failed');
      });
      it('should return a error action ', () => {
        expectInAndOut(
          effects.startExercise$,
          startTaskExerciseAction,
          loadErrorAction
        );
      });
    });
  });

  describe('saveExercise$', () => {
    mockExercise = {
      eduContent: undefined,
      cmiMode: 'normal',
      result: undefined,
      saveToApi: true,
      url: 'dit is een url'
    };

    const saveExerciseAction = new SaveCurrentExercise({
      userId: 6,
      exercise: mockExercise
    });
    const genericSuccessAction = new DalActions.ActionSuccessful({
      successfulAction: 'Exercise saved'
    });
    const loadErrorAction = new CurrentExerciseError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = ExerciseReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('saveExercise', mockExercise);
      });
      it('should trigger an api call with the initialState', () => {
        expectInAndOut(
          effects.saveExercise$,
          saveExerciseAction,
          genericSuccessAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...ExerciseReducer.initialState, loaded: true };
        mockExercise = {
          eduContent: undefined,
          cmiMode: 'normal',
          result: undefined,
          saveToApi: true,
          url: 'dit is een url'
        };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('saveExercise', mockExercise);
      });
      it('should trigger an api call with the with the loaded state', () => {
        expectInAndOut(
          effects.saveExercise$,
          saveExerciseAction,
          genericSuccessAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = ExerciseReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('saveExercise', 'failed');
      });
      it('should return a error action ', () => {
        expectInAndOut(
          effects.saveExercise$,
          saveExerciseAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...ExerciseReducer.initialState,
          loaded: true
        };
      });
      beforeEach(() => {
        mockServiceMethodError('saveExercise', 'failed');
      });
      it('should return a error action ', () => {
        expectInAndOut(
          effects.saveExercise$,
          saveExerciseAction,
          loadErrorAction
        );
      });
    });
  });
});
