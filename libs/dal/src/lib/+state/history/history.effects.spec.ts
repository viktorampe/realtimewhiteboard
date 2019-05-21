import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HistoryReducer } from '.';
import { FavoriteFixture } from '../../+fixtures';
import { HistoryInterface } from '../../+models';
import {
  HistoryLoaded,
  HistoryLoadError,
  LoadHistory,
  StartUpsertHistory,
  UpsertHistory
} from './history.actions';
import {
  HistoryEffects,
  HistoryServiceInterface,
  HISTORY_SERVICE_TOKEN
} from './history.effects';

describe('HistoryEffects', () => {
  let actions: Observable<any>;
  let effects: HistoryEffects;
  let usedState: any;
  let historyService: HistoryServiceInterface;

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
    service: any = HISTORY_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = HISTORY_SERVICE_TOKEN
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
        StoreModule.forFeature(HistoryReducer.NAME, HistoryReducer.reducer, {
          initialState: usedState
        }),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([HistoryEffects])
      ],
      providers: [
        {
          provide: HISTORY_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            upsertHistory: () => {}
          }
        },
        HistoryEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(HistoryEffects);
    historyService = TestBed.get(HISTORY_SERVICE_TOKEN);
  });

  describe('loadHistory$', () => {
    const unforcedLoadAction = new LoadHistory({ userId: 1 });
    const forcedLoadAction = new LoadHistory({ force: true, userId: 1 });
    const filledLoadedAction = new HistoryLoaded({ history: [] });
    const loadErrorAction = new HistoryLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = HistoryReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadHistory$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadHistory$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...HistoryReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadHistory$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadHistory$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = HistoryReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadHistory$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(effects.loadHistory$, forcedLoadAction, loadErrorAction);
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...HistoryReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadHistory$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(effects.loadHistory$, forcedLoadAction, loadErrorAction);
      });
    });
  });

  describe('startUpsertHistory$', () => {
    let mockHistory: HistoryInterface;
    let mockStartUpsertAction: StartUpsertHistory;
    let upsertAction$: BehaviorSubject<StartUpsertHistory>;

    beforeEach(() => {
      // TODO replace with HistoryFixture when merged
      mockHistory = new FavoriteFixture();
      mockStartUpsertAction = new StartUpsertHistory({ history: mockHistory });
      upsertAction$ = new BehaviorSubject(null);
      actions = upsertAction$;
    });

    it('should call the upsertHistory function on the service', () => {
      jest.spyOn(historyService, 'upsertHistory');
      upsertAction$.next(mockStartUpsertAction);

      // service won't be called unless there is a subscriber
      effects.startUpsertHistory$.subscribe();

      expect(historyService.upsertHistory).toHaveBeenCalled();
      expect(historyService.upsertHistory).toHaveBeenCalledTimes(1);
      expect(historyService.upsertHistory).toHaveBeenCalledWith(mockHistory);
    });

    it('should dispatch an UpsertHistory action', () => {
      const upsertedHistory = { ...mockHistory, id: 42 };
      jest
        .spyOn(historyService, 'upsertHistory')
        .mockReturnValue(of(upsertedHistory));

      const expected = new UpsertHistory({ history: upsertedHistory });

      expectInAndOut(
        effects.startUpsertHistory$,
        mockStartUpsertAction,
        expected
      );
    });
  });
});
