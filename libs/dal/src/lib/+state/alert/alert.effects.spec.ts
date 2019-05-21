import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { getTestScheduler, hot } from '@nrwl/nx/testing';
import { undo } from 'ngrx-undo';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { AlertFixture, EffectFeedbackFixture } from '../../+fixtures';
import { UndoService } from '../../../lib/undo';
import { ALERT_SERVICE_TOKEN } from '../../alert/alert.service.interface';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import { ActionSuccessful } from './../dal.actions';
import { EffectFeedbackInterface } from './../effect-feedback/effect-feedback.model';
import {
  AlertsLoaded,
  AlertsLoadError,
  DeleteAlert,
  LoadAlerts,
  LoadNewAlerts,
  NewAlertsLoaded,
  SetAlertReadByFilter,
  SetReadAlert,
  StartPollAlerts,
  StopPollAlerts
} from './alert.actions';
import { AlertsEffects } from './alert.effects';
import { initialState, reducer, State as AlertState } from './alert.reducer';

describe('AlertEffects', () => {
  let actions: Observable<any>;
  let effects: AlertsEffects;
  let undoService: UndoService;
  let usedState: AlertState;
  let uuid: Function;
  let dateMock: MockDate;

  let effectFeedback: EffectFeedbackInterface;

  const mockData = {
    userId: 1,
    updateTime: new Date(1983, 3, 6).getTime(),
    timeDeltaInMinutes: 15,
    personId: 2,
    alertId: 42,
    interval: 30000 //should be a factor of 10
  };

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
    service: any = ALERT_SERVICE_TOKEN
  ): jest.SpyInstance => {
    return jest
      .spyOn(TestBed.get(service), method)
      .mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = ALERT_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockImplementation(() => {
      throw new Error(errorMessage);
    });
  };

  beforeAll(() => {
    dateMock = new MockDate();
    effectFeedback = new EffectFeedbackFixture({
      timeStamp: dateMock.mockDate.getTime()
    });
  });

  afterAll(() => {
    dateMock.returnRealDate();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        StoreModule.forFeature('alerts', reducer, {
          initialState: usedState
        }),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([AlertsEffects])
      ],
      providers: [
        UndoService,
        {
          provide: ALERT_SERVICE_TOKEN,
          useValue: {
            getAllForUser: (userId: number) => {},
            setAlertAsRead: (
              userId: number,
              alertId: number | number[],
              read?: boolean,
              intended?: boolean
            ) => {},
            deleteAlert: (userId: number, alertId: number) => {}
          }
        },
        AlertsEffects,
        DataPersistence,

        provideMockActions(() => actions),
        {
          provide: 'uuid',
          useValue: (): string => 'foo'
        }
      ]
    });

    effects = TestBed.get(AlertsEffects);
    uuid = TestBed.get('uuid');
    effectFeedback.id = uuid();
    undoService = TestBed.get(UndoService);
  });

  describe('loadAlert$', () => {
    const unforcedLoadAction = new LoadAlerts({
      userId: mockData.userId,
      timeStamp: mockData.updateTime
    });
    const forcedLoadAction = new LoadAlerts({
      force: true,
      userId: mockData.userId,
      timeStamp: mockData.updateTime
    });
    const filledLoadedAction = new AlertsLoaded({
      alerts: [],
      timeStamp: mockData.updateTime
    });
    const loadErrorAction = new AlertsLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadAlerts$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadAlerts$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadAlerts$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadAlerts$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadAlerts$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(effects.loadAlerts$, forcedLoadAction, loadErrorAction);
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...initialState,
          loaded: true,
          ids: [],
          entities: {}
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadAlerts$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(effects.loadAlerts$, forcedLoadAction, loadErrorAction);
      });
    });
  });

  describe('loadNewAlert$', () => {
    const unforcedNewLoadActionWithoutTimeDelta = new LoadNewAlerts({
      userId: mockData.userId,
      timeStamp: mockData.updateTime
    });
    const unforcedNewLoadActionWithTimeDelta = new LoadNewAlerts({
      userId: mockData.userId,
      timeStamp: mockData.updateTime + mockData.timeDeltaInMinutes * 60000
    });
    const forcedNewLoadAction = new LoadNewAlerts({
      userId: mockData.userId,
      timeStamp: mockData.updateTime
    });
    const filledNewLoadedAction = new NewAlertsLoaded({
      alerts: [],
      timeStamp: mockData.updateTime
    });
    const unforcedLoadAction = new LoadAlerts({
      userId: mockData.userId
    });
    const loadErrorAction = new AlertsLoadError(new Error('failed'));

    describe('with initialState', () => {
      beforeAll(() => {
        usedState = initialState;
      });
      it('should should return a LoadAlert action if the state is not loaded', () => {
        expectInAndOut(
          effects.loadNewAlerts$,
          unforcedNewLoadActionWithoutTimeDelta,
          unforcedLoadAction
        );
      });
    });

    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = {
          ...initialState,
          loaded: true,
          lastUpdateTimeStamp: mockData.updateTime
        };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadNewAlerts$,
          forcedNewLoadAction,
          filledNewLoadedAction
        );
      });
      it('should trigger an api call with the loaded state if the timeDelta is big enough', () => {
        const filledNewLoadedActionWithTimeDelta = new NewAlertsLoaded({
          alerts: [],
          timeStamp: mockData.updateTime + mockData.timeDeltaInMinutes * 60000
        });

        expectInAndOut(
          effects.loadNewAlerts$,
          unforcedNewLoadActionWithTimeDelta,
          filledNewLoadedActionWithTimeDelta
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...initialState,
          loaded: true,
          lastUpdateTimeStamp: mockData.updateTime,
          ids: [],
          entities: {}
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return an error if the timeDelta is big enough', () => {
        expectInAndOut(
          effects.loadNewAlerts$,
          unforcedNewLoadActionWithTimeDelta,
          loadErrorAction
        );
      });
      it('should return an error action if force is true', () => {
        expectInAndOut(
          effects.loadNewAlerts$,
          forcedNewLoadAction,
          loadErrorAction
        );
      });
    });
  });

  describe('startpollAlerts$', () => {
    const startPollAction = new StartPollAlerts({
      userId: mockData.userId,
      pollingInterval: mockData.interval
    });

    const newLoadAction = new LoadNewAlerts({
      userId: mockData.userId
    });

    beforeAll(() => {
      usedState = initialState;
    });

    beforeEach(() => {
      mockServiceMethodReturnValue('getAllForUser', []);
    });

    it('should dispatch a new LoadNewAlerts action after every interval', () => {
      const INTERVAL_AMOUNT = 4;
      const testScheduler = getTestScheduler();

      const effect = effects.startpollAlerts$.pipe(take(INTERVAL_AMOUNT));
      const triggerAction = startPollAction;
      const effectOutput = newLoadAction;

      // build expected string, based on amount of intervals
      // subtract 1 from interval inside loop, because emmitting values advances 1 frame
      let expected = mockData.interval + 'ms ';
      for (let index = 1; index < INTERVAL_AMOUNT; index++) {
        expected += 'a ' + (mockData.interval - 1).toString() + 'ms ';
      }
      expected += '(a|)';
      // expected output: 30000ms a 29999ms a 29999ms a 29999ms (a|)

      // default testing method not usable, because time progression syntax is not available
      // https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md#behavior-is-different-outside-of-testschedulerruncallback
      testScheduler.run(helpers => {
        actions = hot('a-|', { a: triggerAction });
        helpers.expectObservable(effect).toBe(expected, {
          a: effectOutput
        });
      });
    });
  });

  describe('stopPollAlerts$', () => {
    const startPollAction = new StartPollAlerts({
      userId: mockData.userId,
      pollingInterval: mockData.interval
    });

    const stopPollAction = new StopPollAlerts();

    const newLoadAction = new LoadNewAlerts({
      userId: mockData.userId
    });

    const successAction = new ActionSuccessful({
      successfulAction: 'polling stopped'
    });

    beforeAll(() => {
      usedState = initialState;
    });

    it('should dispatch an ActionSuccessful', () => {
      expectInAndOut(effects.stopPollAlerts$, stopPollAction, successAction);
    });
  });

  describe('setReadAlert$', () => {
    const setReadSingleAction = new SetReadAlert({
      personId: mockData.userId,
      alertIds: mockData.alertId,
      read: true
    });
    const setReadMultipleAction = new SetReadAlert({
      personId: mockData.userId,
      alertIds: [mockData.alertId, mockData.alertId + 1],
      read: true
    });

    const loadAlertsAction = new LoadAlerts({
      userId: mockData.userId
    });

    const setReadSingleUndoAction = undo(setReadSingleAction);
    const setReadMultipleUndoAction = undo(setReadMultipleAction);

    describe('with initialState', () => {
      beforeAll(() => {
        usedState = initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('setAlertAsRead', []);
      });
      it('should return a LoadAlerts action when calling with a single id', () => {
        expectInAndOut(
          effects.setReadAlert$,
          setReadSingleAction,
          loadAlertsAction
        );
      });
      it('should return a LoadAlerts action when calling with multiple ids', () => {
        expectInAndOut(
          effects.setReadAlert$,
          setReadMultipleAction,
          loadAlertsAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('setAlertAsRead', []);
      });

      it('should trigger an api call with the loaded state when calling with a single id', () => {
        effectFeedback.message = 'Melding als gelezen gemarkeerd.';
        effectFeedback.triggerAction = setReadSingleAction;
        effectFeedback.userActions = null;
        effectFeedback.priority = Priority.NORM;
        const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });

        expectInAndOut(
          effects.setReadAlert$,
          setReadSingleAction,
          feedbackAction
        );
      });
      it('should trigger an api call with the loaded state when calling with multiple ids', () => {
        effectFeedback.triggerAction = setReadMultipleAction;

        const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });

        expectInAndOut(
          effects.setReadAlert$,
          setReadMultipleAction,
          feedbackAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...initialState,
          loaded: true,
          ids: [],
          entities: {}
        };
      });
      beforeEach(() => {
        mockServiceMethodError('setAlertAsRead', 'failed');
      });

      it('should return an undo and feedback action when calling with a single id', () => {
        effectFeedback.type = 'error';
        effectFeedback.message =
          'Het is niet gelukt om de melding als gelezen te markeren.';
        effectFeedback.triggerAction = setReadSingleAction;
        effectFeedback.userActions = [
          { title: 'Opnieuw', userAction: setReadSingleAction }
        ];
        effectFeedback.priority = Priority.HIGH;

        const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });

        actions = hot('a', { a: setReadSingleAction });
        expect(effects.setReadAlert$).toBeObservable(
          hot('(ab)', {
            a: setReadSingleUndoAction,
            b: feedbackAction
          })
        );
      });

      it('should return a undo and feedback action when calling with multiple ids', () => {
        effectFeedback.triggerAction = setReadMultipleAction;
        effectFeedback.userActions = [
          { title: 'Opnieuw', userAction: setReadMultipleAction }
        ];

        const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback
        });

        actions = hot('a', { a: setReadMultipleAction });
        expect(effects.setReadAlert$).toBeObservable(
          hot('(ab)', {
            a: setReadMultipleUndoAction,
            b: feedbackAction
          })
        );
      });
    });
  });

  describe('setAlertsReadByFilter', () => {
    const setAlertByFilterAction = new SetAlertReadByFilter({
      personId: mockData.userId,
      read: true,
      filter: {
        taskId: 3
      },
      intended: false
    });

    const setAlertReadAction = new SetReadAlert({
      personId: mockData.userId,
      read: true,
      alertIds: [4],
      intended: false
    });

    beforeAll(() => {
      usedState = {
        ...initialState,
        loaded: true,
        ids: [4],
        entities: {
          4: new AlertFixture({ id: 4, read: false, taskId: 3 })
        }
      };
    });

    it('should trigger an api call to set the alerts read', () => {
      expectInAndOut(
        effects.setAlertsReadByFilter$,
        setAlertByFilterAction,
        setAlertReadAction
      );
    });
  });

  describe('deleteAlert$', () => {
    let deleteAlertSuccessAction: EffectFeedbackActions.AddEffectFeedback;
    let deleteAlertFailureAction: EffectFeedbackActions.AddEffectFeedback;
    let effectFeedbackSuccess: EffectFeedback;
    let effectFeedbackError: EffectFeedback;

    const deleteAlertAction = new DeleteAlert({
      id: mockData.alertId,
      personId: mockData.userId
    });
    const deleteAlertUndoAction = undo(deleteAlertAction);

    beforeAll(() => {
      usedState = initialState;

      effectFeedbackSuccess = {
        ...effectFeedback,
        triggerAction: deleteAlertAction,
        message: 'Melding is verwijderd.',
        type: 'success',
        display: true,
        priority: Priority.NORM,
        userActions: null
      };

      effectFeedbackError = {
        ...effectFeedbackSuccess,
        message: 'Het is niet gelukt om de melding te verwijderen.',
        type: 'error',
        userActions: [{ title: 'Opnieuw', userAction: deleteAlertAction }],
        priority: Priority.HIGH
      };

      deleteAlertSuccessAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: effectFeedbackSuccess
      });
      deleteAlertFailureAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: effectFeedbackError
      });
    });
    beforeEach(() => {
      mockServiceMethodReturnValue('deleteAlert', {});
    });

    describe('the user does not cancel the deletion', () => {
      describe('when deletion is successfull', () => {
        it('should dispatch a success action', () => {
          const deleteFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback(
            { id: 'foo' }
          );
          actions = hot('-ab|', {
            a: deleteAlertAction,
            b: deleteFeedbackAction
          });
          expect(effects.deleteAlert$).toBeObservable(
            hot('--a|', {
              a: deleteAlertSuccessAction
            })
          );
        });
      });

      describe('when there is an error', () => {
        beforeEach(() => {
          mockServiceMethodError('deleteAlert', 'Oops, something went wrong!');
        });
        it('should dispatch an undo action', () => {
          const deleteFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback(
            { id: 'foo' }
          );
          actions = hot('ab', {
            a: deleteAlertAction,
            b: deleteFeedbackAction
          });
          expect(effects.deleteAlert$).toBeObservable(
            hot('-(ab)', {
              a: deleteAlertUndoAction,
              b: deleteAlertFailureAction
            })
          );
        });
      });
    });

    describe('the user does cancels the deletion', () => {
      describe('when deletion is successfull', () => {
        it('should dispatch a success action', () => {
          const undoAction = {
            type: 'ngrx-undo/UNDO_ACTION',
            payload: deleteAlertAction
          };
          const undoServiceSpy = jest
            .spyOn(undoService, 'undo')
            .mockReturnValue(undoAction);
          const deleteFeedbackAction = new EffectFeedbackActions.DeleteEffectFeedback(
            {
              id: 'foo',
              userAction: undoAction
            }
          );
          const expectedEffectFeedback = new EffectFeedback({
            id: 'foo',
            triggerAction: deleteAlertAction,
            message: 'Melding is niet verwijderd.',
            userActions: null,
            type: 'success',
            priority: Priority.NORM
          });
          actions = hot('-ab|', {
            a: deleteAlertAction,
            b: deleteFeedbackAction
          });
          expect(effects.deleteAlert$).toBeObservable(
            hot('--a|', {
              a: new EffectFeedbackActions.AddEffectFeedback({
                effectFeedback: expectedEffectFeedback
              })
            })
          );
          expect(undoServiceSpy).toHaveBeenCalledTimes(1);
          expect(undoServiceSpy).toHaveBeenCalledWith(deleteAlertAction);
        });
      });
    });
  });
});
