import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { BundleReducer } from '.';
import { UnlockedContentFixture } from '../../+fixtures';
import { BUNDLE_SERVICE_TOKEN } from '../../bundle/bundle.service.interface';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import { AddUnlockedContent } from '../unlocked-content/unlocked-content.actions';
import {
  BundlesLoaded,
  BundlesLoadError,
  LinkEduContent,
  LinkUserContent,
  LoadBundles
} from './bundle.actions';
import { BundlesEffects } from './bundle.effects';

describe('BundleEffects', () => {
  let actions: Observable<any>;
  let effects: BundlesEffects;
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
    service: any = BUNDLE_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = BUNDLE_SERVICE_TOKEN
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
        StoreModule.forFeature(BundleReducer.NAME, BundleReducer.reducer, {
          initialState: usedState
        }),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([BundlesEffects])
      ],
      providers: [
        {
          provide: BUNDLE_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            linkEduContent: () => [],
            linkUserContent: () => []
          }
        },
        BundlesEffects,
        DataPersistence,
        provideMockActions(() => actions),
        {
          provide: 'uuid',
          useValue: () => 'foo'
        }
      ]
    });

    effects = TestBed.get(BundlesEffects);
    uuid = TestBed.get('uuid');
  });

  beforeAll(() => {
    mockDate = new MockDate();
  });

  afterAll(() => {
    mockDate.returnRealDate();
  });

  describe('loadBundle$', () => {
    const unforcedLoadAction = new LoadBundles({ userId: 1 });
    const forcedLoadAction = new LoadBundles({ force: true, userId: 1 });
    const filledLoadedAction = new BundlesLoaded({ bundles: [] });
    const loadErrorAction = new BundlesLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = BundleReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadBundles$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadBundles$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...BundleReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadBundles$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadBundles$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = BundleReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadBundles$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(effects.loadBundles$, forcedLoadAction, loadErrorAction);
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...BundleReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadBundles$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(effects.loadBundles$, forcedLoadAction, loadErrorAction);
      });
    });
  });

  describe('linkEduContent$', () => {
    let effectFeedback: EffectFeedback;
    let addFeedbackAction: EffectFeedbackActions.AddEffectFeedback;

    const unlockedContent = new UnlockedContentFixture();
    const linkEduContentAction = new LinkEduContent({
      bundleId: 1,
      eduContentId: 1
    });
    const addUserContentAction = new AddUnlockedContent({
      unlockedContent
    });

    describe('when successful', () => {
      beforeAll(() => {
        effectFeedback = new EffectFeedback({
          id: uuid(),
          triggerAction: linkEduContentAction,
          message: 'Het lesmateriaal is aan de bundel toegevoegd.'
        });
        addFeedbackAction = new AddEffectFeedback({ effectFeedback });
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('linkEduContent', [
          unlockedContent,
          unlockedContent
        ]);
      });

      it('should dispatch addUnlockedContent actions', () => {
        actions = hot('a', {
          a: linkEduContentAction
        });
        expect(effects.linkEduContent$).toBeObservable(
          hot('(abc)', {
            a: addUserContentAction,
            b: addUserContentAction,
            c: addFeedbackAction
          })
        );
      });
    });

    describe('when errored', () => {
      beforeAll(() => {
        effectFeedback = new EffectFeedback({
          id: uuid(),
          triggerAction: linkEduContentAction,
          message:
            'Het is niet gelukt om het lesmateriaal aan de bundel toe te voegen.',
          type: 'error',
          userActions: [
            { title: 'Opnieuw proberen', userAction: linkEduContentAction }
          ],
          priority: Priority.HIGH
        });
        addFeedbackAction = new AddEffectFeedback({ effectFeedback });
      });

      beforeEach(() => {
        mockServiceMethodError('linkEduContent', 'Something went wrong');
      });

      it('should dispatch an error feedback action', () => {
        expectInAndOut(
          effects.linkEduContent$,
          linkEduContentAction,
          addFeedbackAction
        );
      });
    });
  });
  describe('linkUserContent$', () => {
    const unlockedContent = new UnlockedContentFixture();
    const linkUserContentAction = new LinkUserContent({
      bundleId: 1,
      userContentId: 1
    });
    const addUserContentAction = new AddUnlockedContent({
      unlockedContent
    });

    let effectFeedback: EffectFeedback;
    let addFeedbackAction: EffectFeedbackActions.AddEffectFeedback;

    describe('when successful', () => {
      beforeAll(() => {
        effectFeedback = new EffectFeedback({
          id: uuid(),
          triggerAction: linkUserContentAction,
          message: 'Het eigen lesmateriaal is aan de bundel toegevoegd.'
        });
        addFeedbackAction = new AddEffectFeedback({ effectFeedback });
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('linkUserContent', [
          unlockedContent,
          unlockedContent
        ]);
      });

      it('should dispatch addUnlockedContent actions', () => {
        actions = hot('a', {
          a: linkUserContentAction
        });
        expect(effects.linkUserContent$).toBeObservable(
          hot('(abc)', {
            a: addUserContentAction,
            b: addUserContentAction,
            c: addFeedbackAction
          })
        );
      });
    });

    describe('when errored', () => {
      beforeAll(() => {
        effectFeedback = new EffectFeedback({
          id: uuid(),
          triggerAction: linkUserContentAction,
          message:
            'Het is niet gelukt om het eigen lesmateriaal aan de bundel toe te voegen.',
          type: 'error',
          userActions: [
            { title: 'Opnieuw proberen', userAction: linkUserContentAction }
          ],
          priority: Priority.HIGH
        });
        addFeedbackAction = new AddEffectFeedback({ effectFeedback });
      });

      beforeEach(() => {
        mockServiceMethodError('linkUserContent', 'Something went wrong');
      });

      it('should dispatch an error feedback action', () => {
        expectInAndOut(
          effects.linkUserContent$,
          linkUserContentAction,
          addFeedbackAction
        );
      });
    });
  });
});
