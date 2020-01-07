import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { DiaboloPhaseReducer } from '.';
import { DIABOLO_PHASE_SERVICE_TOKEN } from '../../metadata/diabolo-phase.service.interface';
import {
  DiaboloPhasesLoaded,
  DiaboloPhasesLoadError,
  LoadDiaboloPhases
} from './diabolo-phase.actions';
import { DiaboloPhaseEffects } from './diabolo-phase.effects';

describe('DiaboloPhaseEffects', () => {
  let actions: Observable<any>;
  let effects: DiaboloPhaseEffects;
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
    service: any = DIABOLO_PHASE_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = DIABOLO_PHASE_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockImplementation(() => {
      throw new Error(errorMessage);
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        StoreModule.forFeature(
          DiaboloPhaseReducer.NAME,
          DiaboloPhaseReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([DiaboloPhaseEffects])
      ],
      providers: [
        {
          provide: DIABOLO_PHASE_SERVICE_TOKEN,
          useValue: {
            getAll: () => {}
          }
        },
        DiaboloPhaseEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(DiaboloPhaseEffects);
  });

  describe('loadDiaboloPhase$', () => {
    const unforcedLoadAction = new LoadDiaboloPhases({ userId: 1 });
    const forcedLoadAction = new LoadDiaboloPhases({ force: true, userId: 1 });
    const filledLoadedAction = new DiaboloPhasesLoaded({ diaboloPhases: [] });
    const loadErrorAction = new DiaboloPhasesLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = DiaboloPhaseReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAll', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadDiaboloPhases$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadDiaboloPhases$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...DiaboloPhaseReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAll', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadDiaboloPhases$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadDiaboloPhases$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = DiaboloPhaseReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAll', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadDiaboloPhases$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadDiaboloPhases$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...DiaboloPhaseReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAll', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadDiaboloPhases$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadDiaboloPhases$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
});
