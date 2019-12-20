import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { cold, hot } from '@nrwl/angular/testing';
import { undo } from 'ngrx-undo';
import { Observable, of } from 'rxjs';
import { UnlockedFreePracticeReducer } from '.';
import { UnlockedFreePracticeFixture } from '../../+fixtures';
import {
  UnlockedFreePracticeServiceInterface,
  UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN
} from '../../unlocked-free-practice/unlocked-free-practice.service.interface';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  DeleteUnlockedFreePractices,
  LoadUnlockedFreePractices,
  StartAddManyUnlockedFreePractices,
  UnlockedFreePracticesLoaded,
  UnlockedFreePracticesLoadError
} from './unlocked-free-practice.actions';
import { UnlockedFreePracticeEffects } from './unlocked-free-practice.effects';

describe('UnlockedFreePracticeEffects', () => {
  let actions: Observable<any>;
  let effects: UnlockedFreePracticeEffects;
  let usedState: any;
  let uuid: Function;
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
    service: any = UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN
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
          UnlockedFreePracticeReducer.NAME,
          UnlockedFreePracticeReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([UnlockedFreePracticeEffects])
      ],
      providers: [
        {
          provide: UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            deleteUnlockedFreePractices: () => {},
            createUnlockedFreePractices: () => {}
          }
        },
        {
          provide: 'uuid',
          useValue: (): string => 'foo'
        },
        UnlockedFreePracticeEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(UnlockedFreePracticeEffects);
    uuid = TestBed.get('uuid');
  });

  describe('loadUnlockedFreePractice$', () => {
    const unforcedLoadAction = new LoadUnlockedFreePractices({ userId: 1 });
    const forcedLoadAction = new LoadUnlockedFreePractices({
      force: true,
      userId: 1
    });
    const filledLoadedAction = new UnlockedFreePracticesLoaded({
      unlockedFreePractices: []
    });
    const loadErrorAction = new UnlockedFreePracticesLoadError(
      new Error('failed')
    );
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = UnlockedFreePracticeReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadUnlockedFreePractices$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedFreePractices$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = {
          ...UnlockedFreePracticeReducer.initialState,
          loaded: true
        };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadUnlockedFreePractices$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedFreePractices$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = UnlockedFreePracticeReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadUnlockedFreePractices$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedFreePractices$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...UnlockedFreePracticeReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadUnlockedFreePractices$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedFreePractices$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });

  describe('deleteUnlockedFreePractices$', () => {
    let unlockedFreePracticeService: UnlockedFreePracticeServiceInterface;

    beforeEach(() => {
      unlockedFreePracticeService = TestBed.get(
        UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN
      );
    });

    it('should call service.deleteUnlockedFreePractices and return an addFeedbackAction if no error occured', () => {
      const ids = [1];
      const userId = 1;
      const deleteAction = new DeleteUnlockedFreePractices({
        ids,
        userId
      });
      const addFeedbackAction = new AddEffectFeedback({
        effectFeedback: new EffectFeedback({
          id: uuid(),
          triggerAction: deleteAction,
          message: "De 'vrij oefenen' status werd gewijzigd."
        })
      });
      const spy = jest
        .spyOn(unlockedFreePracticeService, 'deleteUnlockedFreePractices')
        .mockReturnValue(of(true));

      expectInAndOut(
        effects.deleteUnlockedFreePractices$,
        deleteAction,
        addFeedbackAction
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(userId, ids);
    });

    it('should return an undoAction and a feedbackAction if an error occured', () => {
      const ids = [1];
      const userId = 1;
      const deleteAction = new DeleteUnlockedFreePractices({ ids, userId });
      const spy = jest
        .spyOn(unlockedFreePracticeService, 'deleteUnlockedFreePractices')
        .mockImplementation(() => {
          throw Error('some error');
        });
      const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: EffectFeedback.generateErrorFeedback(
          uuid(),
          deleteAction,
          "Het is niet gelukt om de 'vrij oefenen' status aan te passen."
        )
      });

      actions = hot('-a', { a: deleteAction });
      expect(effects.deleteUnlockedFreePractices$).toBeObservable(
        hot('-(ab)', {
          a: undo(deleteAction),
          b: feedbackAction
        })
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('startAddLearningPlanGoalProgresses', () => {
    let unlockedFreePracticeService: UnlockedFreePracticeServiceInterface;
    const userId = 1;

    beforeEach(() => {
      unlockedFreePracticeService = TestBed.get(
        UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN
      );
    });

    it('should make the service call and return an action', () => {
      const unlockedFreePractices = [
        new UnlockedFreePracticeFixture({
          classGroupId: 5,
          eduContentBookId: 1
        })
      ];

      const startAddAction = new StartAddManyUnlockedFreePractices({
        userId,
        unlockedFreePractices
      });

      const returnedValues = unlockedFreePractices.map((ufp, index) => {
        return Object.assign(ufp, { id: index + 1 });
      });

      const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: new EffectFeedback({
          id: uuid(),
          triggerAction: startAddAction,
          message: "De 'vrij oefenen' status werd gewijzigd."
        })
      });

      jest
        .spyOn(unlockedFreePracticeService, 'createUnlockedFreePractices')
        .mockReturnValue(of(returnedValues));

      actions = hot('a', { a: startAddAction });

      expect(effects.startAddManyUnlockedFreePractices$).toBeObservable(
        cold('(ab)', {
          a: new LoadUnlockedFreePractices({
            userId,
            force: true
          }),
          b: feedbackAction
        })
      );

      expect(
        unlockedFreePracticeService.createUnlockedFreePractices
      ).toHaveBeenCalledWith(userId, unlockedFreePractices);
    });

    it('should return a feedbackAction if an error occured', () => {
      jest
        .spyOn(unlockedFreePracticeService, 'createUnlockedFreePractices')
        .mockImplementation(() => {
          throw Error('some error');
        });

      const startAddAction = new StartAddManyUnlockedFreePractices({
        userId,
        unlockedFreePractices: []
      });

      actions = hot('a', { a: startAddAction });

      const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: new EffectFeedback({
          id: uuid(),
          triggerAction: startAddAction,
          message:
            "Het is niet gelukt om de 'vrij oefenen' status van het hoofdstuk aan te passen.",
          userActions: [
            { title: 'Opnieuw proberen', userAction: startAddAction }
          ],
          type: 'error',
          priority: Priority.HIGH
        })
      });

      expect(effects.startAddManyUnlockedFreePractices$).toBeObservable(
        hot('a', {
          a: feedbackAction
        })
      );
    });
  });
});
