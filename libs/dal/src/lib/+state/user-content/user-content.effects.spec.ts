import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { USER_CONTENT_SERVICE_TOKEN } from '../../bundle/user-content.service.interface';
import {
  LoadUserContents,
  UserContentsLoaded,
  UserContentsLoadError
} from './user-content.actions';
import { UserContentsEffects } from './user-content.effects';
import { initialState, reducer } from './user-content.reducer';

describe('UserContentEffects', () => {
  let actions: Observable<any>;
  let effects: UserContentsEffects;
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
    service: any = USER_CONTENT_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = USER_CONTENT_SERVICE_TOKEN
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
        StoreModule.forFeature('userContent', reducer, {
          initialState: usedState
        }),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([UserContentsEffects])
      ],
      providers: [
        {
          provide: USER_CONTENT_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {}
          }
        },
        UserContentsEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(UserContentsEffects);
  });

  describe('loadUserContent$', () => {
    const unforcedLoadAction = new LoadUserContents({});
    const forcedLoadAction = new LoadUserContents({ force: true });
    const filledLoadedAction = new UserContentsLoaded({ userContents: [] });
    const loadErrorAction = new UserContentsLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadUserContents$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadUserContents$,
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
        expectInNoOut(effects.loadUserContents$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadUserContents$,
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
          effects.loadUserContents$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUserContents$,
          forcedLoadAction,
          loadErrorAction
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
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadUserContents$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUserContents$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
});
