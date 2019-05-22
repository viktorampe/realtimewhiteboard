import { TestBed } from '@angular/core/testing';
import { ScormCmiMode } from '@campus/scorm';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { undo } from 'ngrx-undo';
import { Observable, of } from 'rxjs';
import { CurrentExerciseReducer } from '.';
import { EXERCISE_SERVICE_TOKEN } from '../../exercise/exercise.service.interface';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import { LoadTaskEduContents } from '../task-edu-content/task-edu-content.actions';
import {
  CurrentExerciseError,
  CurrentExerciseLoaded,
  LoadExercise,
  SaveCurrentExercise
} from './current-exercise.actions';
import { CurrentExerciseEffects } from './current-exercise.effects';
import {
  CurrentExerciseInterface,
  initialState
} from './current-exercise.reducer';

describe('ExerciseEffects', () => {
  let actions: Observable<any>;
  let effects: CurrentExerciseEffects;
  let usedState: CurrentExerciseReducer.State;
  let mockExercise: CurrentExerciseInterface;
  let mockExerciseNoSave: CurrentExerciseInterface;
  let uuid: Function;

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
        StoreModule.forFeature(
          CurrentExerciseReducer.NAME,
          CurrentExerciseReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([CurrentExerciseEffects])
      ],
      providers: [
        {
          provide: EXERCISE_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            loadExercise: () => mockExercise,
            saveExercise: () => mockExercise
          }
        },
        CurrentExerciseEffects,
        DataPersistence,
        provideMockActions(() => actions),
        {
          provide: 'uuid',
          useValue: () => 'foo'
        }
      ]
    });

    effects = TestBed.get(CurrentExerciseEffects);
    uuid = TestBed.get('uuid');
  });

  describe('startExercise$', () => {
    mockExercise = {
      eduContentId: undefined,
      cmiMode: ScormCmiMode.CMI_MODE_NORMAL,
      result: undefined,
      saveToApi: true,
      url: 'dit is een url'
    };

    const startTaskExerciseAction = new LoadExercise({
      userId: 6,
      educontentId: 1,
      saveToApi: true,
      taskId: 1,
      cmiMode: ScormCmiMode.CMI_MODE_BROWSE
    });
    const startUnlockedContentExerciseAction = new LoadExercise({
      userId: 6,
      educontentId: 1,
      saveToApi: true,
      unlockedContentId: 1,
      cmiMode: ScormCmiMode.CMI_MODE_NORMAL
    });
    const filledLoadedAction = new CurrentExerciseLoaded(mockExercise);
    const loadErrorAction = new CurrentExerciseError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = CurrentExerciseReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('loadExercise', mockExercise);
      });
      it('should trigger an api call for a task', () => {
        expectInAndOut(
          effects.loadExercise$,
          startTaskExerciseAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call for an unlockedContent', () => {
        expectInAndOut(
          effects.loadExercise$,
          startUnlockedContentExerciseAction,
          filledLoadedAction
        );
      });
    });
    describe('with failing api call', () => {
      beforeAll(() => {
        usedState = CurrentExerciseReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('loadExercise', 'failed');
      });
      it('should return a error action ', () => {
        expectInAndOut(
          effects.loadExercise$,
          startTaskExerciseAction,
          loadErrorAction
        );
      });
    });
  });

  describe('saveExercise$', () => {
    mockExercise = {
      eduContentId: undefined,
      cmiMode: ScormCmiMode.CMI_MODE_NORMAL,
      saveToApi: true,
      url: 'dit is een url'
    };

    mockExerciseNoSave = {
      ...mockExercise,
      saveToApi: false
    };

    const saveExerciseAction = new SaveCurrentExercise({
      userId: 6,
      exercise: mockExercise
    });

    const noSaveExerciseAction = new SaveCurrentExercise({
      userId: 6,
      exercise: mockExerciseNoSave
    });

    const loadErrorAction = new CurrentExerciseError(new Error('failed'));

    describe('with initialState', () => {
      beforeAll(() => {
        usedState = initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('saveExercise', mockExercise);
      });
      it('should trigger an api call', () => {
        const mockDate = new MockDate();

        const effectFeedBackAction = new EffectFeedbackActions.AddEffectFeedback(
          {
            effectFeedback: new EffectFeedback({
              id: uuid(),
              triggerAction: saveExerciseAction,
              message: 'Oefening is bewaard.'
            })
          }
        );

        actions = hot('a', { a: saveExerciseAction });
        expect(effects.saveExercise$).toBeObservable(
          hot('(ab)', {
            a: effectFeedBackAction,
            b: new LoadTaskEduContents({
              userId: 6,
              force: true
            })
          })
        );
        mockDate.returnRealDate();
      });

      it('should not trigger an api call if saveToApi is false', () => {
        expectInNoOut(effects.saveExercise$, noSaveExerciseAction);
      });
    });

    describe('with failing api call', () => {
      beforeAll(() => {
        usedState = initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('saveExercise', 'failed');
      });
      it('should return a error action ', () => {
        const mockDate = new MockDate();

        actions = hot('-(a)', { a: saveExerciseAction });

        const expectedActions$ = hot('-(abc)', {
          a: undo(saveExerciseAction),
          b: new AddEffectFeedback({
            effectFeedback: new EffectFeedback({
              id: uuid(),
              triggerAction: saveExerciseAction,
              message: 'Het is niet gelukt om de oefening te bewaren.',
              userActions: [
                {
                  title: 'Opnieuw proberen.',
                  userAction: saveExerciseAction
                }
              ],
              type: 'error',
              priority: Priority.HIGH
            })
          }),
          c: loadErrorAction
        });
        expect(effects.saveExercise$).toBeObservable(expectedActions$);

        mockDate.returnRealDate();
      });
    });
  });
});
