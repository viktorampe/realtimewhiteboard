import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { MethodReducer } from '.';
import { METHOD_SERVICE_TOKEN } from '../../metadata/method.service.interface';
import {
  AllowedMethodsLoaded,
  AllowedMethodsLoadError,
  LoadAllowedMethods,
  LoadMethods,
  MethodsLoaded,
  MethodsLoadError
} from './method.actions';
import { MethodEffects } from './method.effects';

describe('MethodEffects', () => {
  let actions: Observable<any>;
  let effects: MethodEffects;
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
    service: any = METHOD_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = METHOD_SERVICE_TOKEN
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
        StoreModule.forFeature(MethodReducer.NAME, MethodReducer.reducer, {
          initialState: usedState
        }),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([MethodEffects])
      ],
      providers: [
        {
          provide: METHOD_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            getAllowedMethodIds: () => {}
          }
        },
        MethodEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(MethodEffects);
  });

  describe('loadMethod$', () => {
    const unforcedLoadAction = new LoadMethods();
    const forcedLoadAction = new LoadMethods({ force: true });
    const filledLoadedAction = new MethodsLoaded({ methods: [] });
    const loadErrorAction = new MethodsLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = MethodReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadMethods$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadMethods$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...MethodReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadMethods$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadMethods$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = MethodReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadMethods$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(effects.loadMethods$, forcedLoadAction, loadErrorAction);
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...MethodReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadMethods$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(effects.loadMethods$, forcedLoadAction, loadErrorAction);
      });
    });
  });

  describe('loadAllowedMethods$', () => {
    describe('allowedMethodsLoaded=false', () => {
      const allowedMethodsLoadedAction = new AllowedMethodsLoaded({
        methodIds: [1, 2, 5]
      });

      beforeAll(() => {
        usedState = {
          ...MethodReducer.initialState,
          ...{ allowedMethodsLoaded: false }
        };
      });

      beforeEach(() => {
        mockServiceMethodReturnValue('getAllowedMethodIds', [1, 2, 5]);
      });

      it('should return the allowed method ids if force=true', () => {
        const loadAllowedMethodsActionForce = new LoadAllowedMethods({
          force: true,
          userId: 1
        });

        expectInAndOut(
          effects.loadAllowedMethods$,
          loadAllowedMethodsActionForce,
          allowedMethodsLoadedAction
        );
      });

      it('should return the allowed method ids if force=false', () => {
        const loadAllowedMethodsActionNoForce = new LoadAllowedMethods({
          force: false,
          userId: 1
        });

        expectInAndOut(
          effects.loadAllowedMethods$,
          loadAllowedMethodsActionNoForce,
          allowedMethodsLoadedAction
        );
      });

      it('should return an error action', () => {
        const loadAllowedMethodsAction = new LoadAllowedMethods();
        mockServiceMethodError('getAllowedMethodIds', 'I am an error');
        const allowedMethodsLoadError = new AllowedMethodsLoadError(
          new Error('I am an error')
        );

        expectInAndOut(
          effects.loadAllowedMethods$,
          loadAllowedMethodsAction,
          allowedMethodsLoadError
        );
      });
    });

    describe('allowedMethodsLoaded=true', () => {
      beforeAll(() => {
        usedState = {
          ...MethodReducer.initialState,
          ...{ allowedMethodsLoaded: true }
        };
      });

      it('should do nothing if force=false', () => {
        const loadAllowedMethodsAction = new LoadAllowedMethods({
          force: false,
          userId: 1
        });

        expectInNoOut(effects.loadAllowedMethods$, loadAllowedMethodsAction);
      });

      it('should return the allowed method ids if force=true', () => {
        const loadAllowedMethodsAction = new LoadAllowedMethods({
          force: true,
          userId: 1
        });
        mockServiceMethodReturnValue('getAllowedMethodIds', [2, 6]);
        const result = new AllowedMethodsLoaded({ methodIds: [2, 6] });

        expectInAndOut(
          effects.loadAllowedMethods$,
          loadAllowedMethodsAction,
          result
        );
      });
    });
  });
});
