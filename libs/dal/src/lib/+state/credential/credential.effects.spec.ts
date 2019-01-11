import { TestBed } from '@angular/core/testing';
import { PassportUserCredentialInterface } from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { cold, hot } from '@nrwl/nx/testing';
import { undo } from 'ngrx-undo';
import { Observable, of } from 'rxjs';
import { CredentialReducer } from '.';
import { DalActions } from '..';
import {
  CredentialServiceInterface,
  CREDENTIAL_SERVICE_TOKEN
} from '../../persons';
import {
  CredentialsLoaded,
  CredentialsLoadError,
  LoadCredentials,
  UnlinkCredential
} from './credential.actions';
import { CredentialEffects } from './credential.effects';

describe('CredentialEffects', () => {
  let actions: Observable<any>;
  let effects: CredentialEffects;
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
    service: any = CREDENTIAL_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = CREDENTIAL_SERVICE_TOKEN
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
          CredentialReducer.NAME,
          CredentialReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([CredentialEffects])
      ],
      providers: [
        {
          provide: CREDENTIAL_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {}
          }
        },
        CredentialEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(CredentialEffects);
  });

  describe('loadCredential$', () => {
    const unforcedLoadAction = new LoadCredentials({ userId: 1 });
    const forcedLoadAction = new LoadCredentials({ force: true, userId: 1 });
    const filledLoadedAction = new CredentialsLoaded({ credentials: [] });
    const loadErrorAction = new CredentialsLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = CredentialReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadCredentials$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadCredentials$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...CredentialReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadCredentials$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadCredentials$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = CredentialReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadCredentials$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadCredentials$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...CredentialReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadCredentials$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadCredentials$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });

  describe('unlinkCredential$', () => {
    const mockCredential = { id: 1 } as PassportUserCredentialInterface;
    const unlinkAction = new UnlinkCredential({ id: mockCredential.id });
    let credentialService: CredentialServiceInterface;

    beforeEach(() => {
      usedState = CredentialReducer.initialState;
      credentialService = TestBed.get(CREDENTIAL_SERVICE_TOKEN);
    });

    it('should call the credentialService', () => {
      const mockResponse$ = cold('-a-|', { a: true });
      credentialService.unlinkCredential = jest
        .fn()
        .mockReturnValue(mockResponse$);

      actions = hot('-a-|', { a: unlinkAction });

      effects.unlinkCredential$.subscribe(_ => {
        expect(credentialService.unlinkCredential).toHaveBeenCalled();
        expect(credentialService.unlinkCredential).toHaveBeenCalledWith(
          mockCredential
        );
      });
    });

    it('should dispatch an ActionSuccessful', () => {
      const mockResponse$ = cold('-a-|', { a: true });
      credentialService.unlinkCredential = jest
        .fn()
        .mockReturnValue(mockResponse$);

      actions = hot('-a-|', { a: unlinkAction });

      const expected = new DalActions.ActionSuccessful({
        successfulAction: 'Credential unlinked.'
      });

      expect(effects.unlinkCredential$).toBeObservable(
        cold('--a-|', { a: expected })
      );
    });

    it('should dispatch an undo action on a Api failure', () => {
      const mockResponse$ = hot('-#|', 'something went wrong');
      credentialService.unlinkCredential = jest
        .fn()
        .mockReturnValue(mockResponse$);

      actions = hot('-a-|', { a: unlinkAction });

      const expected = undo(unlinkAction);

      expect(effects.unlinkCredential$).toBeObservable(
        cold('-a-|', { a: expected })
      );
    });
  });
});
