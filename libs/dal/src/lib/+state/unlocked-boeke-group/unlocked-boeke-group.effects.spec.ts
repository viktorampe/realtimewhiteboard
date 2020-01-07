import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { UnlockedBoekeGroupReducer } from '.';
import { UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN } from '../../boeke/unlocked-boeke-group.service.interface';
import {
  LoadUnlockedBoekeGroups,
  UnlockedBoekeGroupsLoaded,
  UnlockedBoekeGroupsLoadError
} from './unlocked-boeke-group.actions';
import { UnlockedBoekeGroupsEffects } from './unlocked-boeke-group.effects';

describe('UnlockedBoekeGroupEffects', () => {
  let actions: Observable<any>;
  let effects: UnlockedBoekeGroupsEffects;
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
    service: any = UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN
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
          UnlockedBoekeGroupReducer.NAME,
          UnlockedBoekeGroupReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([UnlockedBoekeGroupsEffects])
      ],
      providers: [
        {
          provide: UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {}
          }
        },
        UnlockedBoekeGroupsEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(UnlockedBoekeGroupsEffects);
  });

  describe('loadUnlockedBoekeGroup$', () => {
    const unforcedLoadAction = new LoadUnlockedBoekeGroups({ userId: 1 });
    const forcedLoadAction = new LoadUnlockedBoekeGroups({
      force: true,
      userId: 1
    });
    const filledLoadedAction = new UnlockedBoekeGroupsLoaded({
      unlockedBoekeGroups: []
    });
    const loadErrorAction = new UnlockedBoekeGroupsLoadError(
      new Error('failed')
    );
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = UnlockedBoekeGroupReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeGroups$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeGroups$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...UnlockedBoekeGroupReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadUnlockedBoekeGroups$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeGroups$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = UnlockedBoekeGroupReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeGroups$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeGroups$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...UnlockedBoekeGroupReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadUnlockedBoekeGroups$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedBoekeGroups$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
});
