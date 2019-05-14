import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { undo } from 'ngrx-undo';
import { Observable, of } from 'rxjs';
import { UnlockedContentReducer } from '.';
import {
  EffectFeedbackFixture,
  EffectFeedbackInterface,
  Priority
} from '../../..';
import { UNLOCKED_CONTENT_SERVICE_TOKEN } from '../../bundle/unlocked-content.service.interface';
import { EffectFeedback } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  DeleteUnlockedContent,
  DeleteUnlockedContents,
  LoadUnlockedContents,
  UnlockedContentsLoaded,
  UnlockedContentsLoadError
} from './unlocked-content.actions';
import { UnlockedContentsEffects } from './unlocked-content.effects';

describe('UnlockedContentEffects', () => {
  let actions: Observable<any>;
  let effects: UnlockedContentsEffects;
  let usedState: any;
  let uuid: Function;
  let dateMock: MockDate;
  let effectFeedback: EffectFeedbackInterface;

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
    service: any = UNLOCKED_CONTENT_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = UNLOCKED_CONTENT_SERVICE_TOKEN
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          UnlockedContentReducer.NAME,
          UnlockedContentReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([UnlockedContentsEffects])
      ],
      providers: [
        {
          provide: UNLOCKED_CONTENT_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            remove: () => {},
            removeAll: () => {}
          }
        },
        UnlockedContentsEffects,
        DataPersistence,
        provideMockActions(() => actions),
        {
          provide: 'uuid',
          useValue: (): string => 'foo'
        }
      ]
    });

    effects = TestBed.get(UnlockedContentsEffects);
    uuid = TestBed.get('uuid');
    effectFeedback.id = uuid();
  });

  describe('loadUnlockedContent$', () => {
    const unforcedLoadAction = new LoadUnlockedContents({ userId: 1 });
    const forcedLoadAction = new LoadUnlockedContents({
      force: true,
      userId: 1
    });
    const filledLoadedAction = new UnlockedContentsLoaded({
      unlockedContents: []
    });
    const loadErrorAction = new UnlockedContentsLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = UnlockedContentReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadUnlockedContents$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedContents$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...UnlockedContentReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadUnlockedContents$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedContents$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = UnlockedContentReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadUnlockedContents$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedContents$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...UnlockedContentReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadUnlockedContents$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadUnlockedContents$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
  describe('deleteUnlockedContent$', () => {
    it('should return a success feedback action if the service returns a value', () => {
      mockServiceMethodReturnValue('remove', {});
      const deleteAction = new DeleteUnlockedContent({
        id: 1,
        customFeedbackHandlers: {
          useCustomErrorHandler: false,
          useCustomSuccessHandler: false
        }
      });
      effectFeedback.triggerAction = deleteAction;
      effectFeedback.message = 'Het lesmateriaal is uit de bundel verwijderd.';
      effectFeedback.display = !EffectFeedback['getCustomHandlerValue'](
        deleteAction.payload,
        'success'
      );
      effectFeedback.userActions = null;
      effectFeedback.type = 'success';
      effectFeedback.priority = Priority.NORM;
      expectInAndOut(
        effects.deleteUnlockedContent$,
        deleteAction,
        new AddEffectFeedback({ effectFeedback })
      );
    });
    it('should return an undo and error feedback action if the service fails', () => {
      const deleteAction = new DeleteUnlockedContent({
        id: 1
      });
      const undoAction = undo(deleteAction);

      effectFeedback.triggerAction = deleteAction;
      effectFeedback.message =
        'Het is niet gelukt om het lesmateriaal uit de bundel te verwijderen.';
      effectFeedback.display = !EffectFeedback['getCustomHandlerValue'](
        deleteAction.payload,
        'error'
      );
      effectFeedback.userActions = [
        { title: 'Opnieuw', userAction: deleteAction }
      ];
      effectFeedback.type = 'error';
      effectFeedback.priority = Priority.HIGH;

      actions = hot('a', { a: deleteAction });
      expect(effects.deleteUnlockedContent$).toBeObservable(
        hot('(ab)', {
          a: undoAction,
          b: new AddEffectFeedback({ effectFeedback })
        })
      );
    });
  });
  describe('deleteUnlockedContents$', () => {
    it('should return a success feedback action if the service returns a value', () => {
      mockServiceMethodReturnValue('removeAll', {});
      const deleteAction = new DeleteUnlockedContents({
        ids: [1]
      });
      effectFeedback.triggerAction = deleteAction;
      effectFeedback.message =
        'De lesmaterialen zijn uit de bundel verwijderd.';
      effectFeedback.display = !EffectFeedback['getCustomHandlerValue'](
        deleteAction.payload,
        'success'
      );
      effectFeedback.userActions = null;
      effectFeedback.type = 'success';
      effectFeedback.priority = Priority.NORM;
      expectInAndOut(
        effects.deleteUnlockedContents$,
        deleteAction,
        new AddEffectFeedback({ effectFeedback })
      );
    });
    it('should return an undo and error feedback action if the service fails', () => {
      const deleteAction = new DeleteUnlockedContents({
        ids: [1]
      });
      const undoAction = undo(deleteAction);

      effectFeedback.triggerAction = deleteAction;
      effectFeedback.message =
        'Het is niet gelukt om de lesmaterialen uit de bundel te verwijderen.';
      effectFeedback.display = !EffectFeedback['getCustomHandlerValue'](
        deleteAction.payload,
        'error'
      );
      effectFeedback.userActions = [
        { title: 'Opnieuw', userAction: deleteAction }
      ];
      effectFeedback.type = 'error';
      effectFeedback.priority = Priority.HIGH;

      actions = hot('a', { a: deleteAction });
      expect(effects.deleteUnlockedContents$).toBeObservable(
        hot('(ab)', {
          a: undoAction,
          b: new AddEffectFeedback({ effectFeedback })
        })
      );
    });
  });
});
