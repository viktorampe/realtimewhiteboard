import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { ALERT_SERVICE_TOKEN } from '../../alert/alert.service.interface';
import { ActionSuccessful } from '../dal.actions';
import {
  AlertsLoaded,
  AlertsLoadError,
  LoadAlerts,
  LoadNewAlerts,
  NewAlertsLoaded,
  SetReadAlert
} from './alert.actions';
import { AlertsEffects } from './alert.effects';
import { initialState, reducer } from './alert.reducer';

describe('AlertEffects', () => {
  let actions: Observable<any>;
  let effects: AlertsEffects;
  let usedState: any;

  const mockData = {
    userId: 1,
    updateTime: new Date(1983, 3, 6),
    timeDeltaInMinutes: 15,
    personId: 2,
    alertId: 42
  };

  function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

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
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
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
        {
          provide: ALERT_SERVICE_TOKEN,
          useValue: {
            getAllForUser: (userId: number) => {},
            setAlertAsRead: (
              userId: number,
              alertId: number | number[],
              read?: boolean,
              intended?: boolean
            ) => {}
          }
        },
        AlertsEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(AlertsEffects);
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
          list: []
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
      timeStamp: addMinutes(mockData.updateTime, mockData.timeDeltaInMinutes)
    });
    const forcedNewLoadAction = new LoadNewAlerts({
      force: true,
      userId: mockData.userId,
      timeStamp: mockData.updateTime
    });
    const filledNewLoadedAction = new NewAlertsLoaded({
      alerts: [],
      timeStamp: mockData.updateTime
    });
    const loadErrorAction = new AlertsLoadError(new Error('failed'));

    describe('with initialState', () => {
      beforeAll(() => {
        usedState = initialState;
      });
      it('should should return nothing if the state is not loaded', () => {
        expectInNoOut(
          effects.loadNewAlerts$,
          unforcedNewLoadActionWithoutTimeDelta
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
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(
          effects.loadAlerts$,
          unforcedNewLoadActionWithoutTimeDelta
        );
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
          timeStamp: addMinutes(
            mockData.updateTime,
            mockData.timeDeltaInMinutes
          )
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
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing  if force is not true and the timeDelta isnt big enough', () => {
        expectInNoOut(
          effects.loadNewAlerts$,
          unforcedNewLoadActionWithoutTimeDelta
        );
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

  describe('pollAlerts$', () => {
    const newLoadAction = new LoadNewAlerts({
      userId: mockData.userId
    });

    beforeAll(() => {
      usedState = initialState;
    });

    beforeEach(() => {
      mockServiceMethodReturnValue('getAllForUser', []);
    });

    it(
      'should dispatch a new LoadNewAlerts action after every interval',
      fakeAsync(() => {
        const intervalTime = 3000;
        const actionArray: LoadNewAlerts[] = [];
        const pollingSubscription = effects.pollAlerts$.subscribe(x =>
          actionArray.push(x)
        );
        expect(actionArray.length).toBe(0);
        tick(intervalTime);
        expect(actionArray.length).toBe(1);
        tick(intervalTime);
        expect(actionArray.length).toBe(2);
        pollingSubscription.unsubscribe();
      })
    );
  });

  describe('setReadAlert$', () => {
    const setReadSingleAction = new SetReadAlert({
      personId: mockData.personId,
      alertIds: mockData.alertId
    });
    const setReadMultipleAction = new SetReadAlert({
      personId: mockData.personId,
      alertIds: [mockData.alertId, mockData.alertId + 1]
    });
    const successAction = new ActionSuccessful({
      successfulAction: 'alert updated'
    });
    const loadErrorAction = new AlertsLoadError(
      new Error('Unable to update alert')
    );
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('setAlertAsRead', []);
      });
      it('should return nothing when calling with a single id', () => {
        expectInNoOut(effects.setReadAlert$, setReadSingleAction);
      });
      it('should return nothing when calling with multiple ids', () => {
        expectInNoOut(effects.setReadAlert$, setReadMultipleAction);
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
        expectInAndOut(
          effects.setReadAlert$,
          setReadSingleAction,
          successAction
        );
      });
      it('should trigger an api call with the loaded state when calling with multiple ids', () => {
        expectInAndOut(
          effects.setReadAlert$,
          setReadMultipleAction,
          successAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('setAlertAsRead', 'failed');
      });
      it('should return a error action when calling with a single id', () => {
        expectInAndOut(
          effects.setReadAlert$,
          setReadSingleAction,
          loadErrorAction
        );
      });
      it('should return a error action when calling with multiple ids', () => {
        expectInAndOut(
          effects.setReadAlert$,
          setReadMultipleAction,
          loadErrorAction
        );
      });
    });
  });
});
