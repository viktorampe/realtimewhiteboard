import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { cold, hot } from '@nrwl/angular/testing';
import { undo } from 'ngrx-undo';
import { Observable, of } from 'rxjs';
import { CredentialEffects, CredentialReducer } from '.';
import { DalActions } from '..';
import { PassportUserCredentialInterface } from '../../+models';
import {
  CredentialServiceInterface,
  CREDENTIAL_SERVICE_TOKEN
} from '../../persons';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import { LoadUser } from '../user/user.actions';
import {
  CredentialsLoaded,
  CredentialsLoadError,
  LoadCredentials,
  UnlinkCredential,
  UseCredentialProfilePicture
} from './credential.actions';

describe('CredentialEffects', () => {
  let actions: Observable<any>;
  let effects: CredentialEffects;
  let usedState: CredentialReducer.State;
  let uuid: Function;
  let dateMock: MockDate;

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
        provideMockActions(() => actions),
        { provide: 'uuid', useValue: () => 'foo' }
      ]
    });

    effects = TestBed.get(CredentialEffects);
    uuid = TestBed.get('uuid');
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
          loaded: true
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
    const unlinkAction = new UnlinkCredential({ credential: mockCredential });
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

  describe('useCredentialProfilePicture$', () => {
    const mockCredential = { id: 1 } as PassportUserCredentialInterface;
    const useCredentialProfilePictureAction = new UseCredentialProfilePicture({
      credential: mockCredential
    });
    let credentialService: CredentialServiceInterface;

    beforeAll(() => {
      dateMock = new MockDate();
    });

    beforeEach(() => {
      usedState = CredentialReducer.initialState;
      credentialService = TestBed.get(CREDENTIAL_SERVICE_TOKEN);
    });

    it('should call the credentialService', () => {
      const mockResponse$ = cold('-a---|', { a: true });
      credentialService.useCredentialProfilePicture = jest
        .fn()
        .mockReturnValue(mockResponse$);

      actions = hot('-a-|', { a: useCredentialProfilePictureAction });

      effects.useCredentialProfilePicture$.subscribe(_ => {
        expect(
          credentialService.useCredentialProfilePicture
        ).toHaveBeenCalled();
        expect(
          credentialService.useCredentialProfilePicture
        ).toHaveBeenCalledWith(mockCredential);
      });
    });

    it('should dispatch an Load User action and a User Update Message action', () => {
      // extra -'s because of the way the marbles are parsed
      const mockResponse$ = cold('-a---|', { a: true });
      credentialService.useCredentialProfilePicture = jest
        .fn()
        .mockReturnValue(mockResponse$);

      actions = hot('-a-|', { a: useCredentialProfilePictureAction });

      const expected = [
        new LoadUser({ force: true }),
        new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback: new EffectFeedback({
            id: uuid(),
            timeStamp: dateMock.mockDate.getTime(),
            triggerAction: useCredentialProfilePictureAction,
            message: 'Je profielfoto is gewijzigd.'
          })
        })
      ];

      expect(effects.useCredentialProfilePicture$).toBeObservable(
        hot('--(ab)|', { a: expected[0], b: expected[1] })
      );
    });

    it('should dispatch an undo action on a Api failure', () => {
      const mockResponse$ = cold('-#|', 'something went wrong');
      credentialService.useCredentialProfilePicture = jest
        .fn()
        .mockReturnValue(mockResponse$);

      actions = hot('-a-|', { a: useCredentialProfilePictureAction });

      const expected = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: new EffectFeedback({
          id: uuid(),
          timeStamp: dateMock.mockDate.getTime(),
          triggerAction: useCredentialProfilePictureAction,
          message: 'Het is niet gelukt om je profielfoto te wijzigen.',
          type: 'error',
          userActions: [
            {
              title: 'Opnieuw proberen.',
              userAction: useCredentialProfilePictureAction
            }
          ],
          priority: Priority.HIGH
        })
      });

      expect(effects.useCredentialProfilePicture$).toBeObservable(
        hot('--a|', { a: expected })
      );
    });

    afterAll(() => {
      dateMock.returnRealDate();
    });
  });
});
