import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { undo } from 'ngrx-undo';
import { Observable, of } from 'rxjs';
import { FavoriteReducer } from '.';
import { EffectFeedbackFixture } from '../../+fixtures';
import { FavoriteTypesEnum } from '../../+models';
import { FAVORITE_SERVICE_TOKEN } from '../../favorite/favorite.service.interface';
import { AUTH_SERVICE_TOKEN } from '../../persons';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  AddFavorite,
  DeleteFavorite,
  FavoritesLoaded,
  FavoritesLoadError,
  LoadFavorites,
  StartAddFavorite,
  ToggleFavorite,
  UpdateFavorite
} from './favorite.actions';
import { FavoriteEffects } from './favorite.effects';

describe('FavoriteEffects', () => {
  let actions: Observable<any>;
  let effects: FavoriteEffects;
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
    service: any = FAVORITE_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = FAVORITE_SERVICE_TOKEN
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
        StoreModule.forFeature(FavoriteReducer.NAME, FavoriteReducer.reducer, {
          initialState: usedState
        }),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([FavoriteEffects])
      ],
      providers: [
        {
          provide: 'uuid',
          useValue: (): string => 'foo'
        },
        {
          provide: FAVORITE_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            addFavorite: () => {},
            deleteFavorite: () => {},
            updateFavorite: () => {}
          }
        },
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: {
            userId: 1
          }
        },
        FavoriteEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(FavoriteEffects);
    uuid = TestBed.get('uuid');
  });

  beforeAll(() => {
    mockDate = new MockDate();
  });

  afterAll(() => {
    mockDate.returnRealDate();
  });

  describe('loadFavorite$', () => {
    const unforcedLoadAction = new LoadFavorites({ userId: 1 });
    const forcedLoadAction = new LoadFavorites({ force: true, userId: 1 });
    const filledLoadedAction = new FavoritesLoaded({ favorites: [] });
    const loadErrorAction = new FavoritesLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = FavoriteReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadFavorites$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadFavorites$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...FavoriteReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadFavorites$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadFavorites$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = FavoriteReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadFavorites$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadFavorites$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...FavoriteReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadFavorites$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadFavorites$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });

  describe('toggleFavorite$', () => {
    const favorite = {
      id: 123,
      type: FavoriteTypesEnum.AREA,
      created: new Date()
    };
    const toggleFavoriteAction = new ToggleFavorite({
      favorite
    });
    const startAddFavoriteAction = new StartAddFavorite({
      userId: 1,
      favorite
    });

    const deleteFavoriteAction = new DeleteFavorite({
      userId: 1,
      id: favorite.id
    });
    describe('when the item is already marked as favorite', () => {
      beforeAll(() => {
        usedState = {
          ...FavoriteReducer.initialState,
          ids: [123],
          entities: { 123: favorite }
        };
      });

      beforeEach(() => {
        mockServiceMethodReturnValue('deleteFavorite', true);
      });
      it('should dispatch a deleteFavorite action', () => {
        expectInAndOut(
          effects.toggleFavorite$,
          toggleFavoriteAction,
          deleteFavoriteAction
        );
      });
    });
    describe('when item is not yet marked as favorite', () => {
      beforeAll(() => {
        usedState = FavoriteReducer.initialState;
      });

      beforeEach(() => {
        mockServiceMethodReturnValue('addFavorite', []);
      });
      it('should dispatch an add action if item is not yet a favorite', () => {
        expectInAndOut(
          effects.toggleFavorite$,
          toggleFavoriteAction,
          startAddFavoriteAction
        );
      });
    });
  });

  describe('startAddFavorite$', () => {
    const favorite = {
      id: 123,
      type: FavoriteTypesEnum.AREA,
      created: new Date()
    };

    const startAddFavoriteAction = new StartAddFavorite({
      userId: 1,
      favorite
    });
    const addFavoriteAction = new AddFavorite({ favorite });

    describe('when succesful', () => {
      beforeAll(() => {
        usedState = FavoriteReducer.initialState;
      });

      beforeEach(() => {
        mockServiceMethodReturnValue('addFavorite', favorite);
      });
      it('should dispatch an addFavorite action', () => {
        expectInAndOut(
          effects.startAddFavorite$,
          startAddFavoriteAction,
          addFavoriteAction
        );
      });
    });

    describe('when failed', () => {
      let effectFeedback: EffectFeedback;
      let addFeedbackAction: EffectFeedbackActions.AddEffectFeedback;

      beforeAll(() => {
        effectFeedback = new EffectFeedback({
          id: uuid(),
          triggerAction: startAddFavoriteAction,
          message:
            'Het is niet gelukt om het item aan jouw favorieten toe te voegen.',
          type: 'error',
          userActions: [
            { title: 'Opnieuw proberen', userAction: startAddFavoriteAction }
          ],
          display: true,
          priority: Priority.HIGH
        });
        addFeedbackAction = new AddEffectFeedback({ effectFeedback });
        usedState = FavoriteReducer.initialState;
      });

      beforeEach(() => {
        mockServiceMethodError('addFavorite', 'Something went wrong.');
      });
      it('should dispatch an error feedback action', () => {
        expectInAndOut(
          effects.startAddFavorite$,
          startAddFavoriteAction,
          addFeedbackAction
        );
      });
    });
  });

  describe('deleteFavorite$', () => {
    const deleteFavoriteAction = new DeleteFavorite({ userId: 1, id: 113 });

    describe('when successful', () => {
      beforeEach(() => {
        mockServiceMethodReturnValue('deleteFavorite', true);
      });
      it('should dispatch a success feedback action', () => {
        const effectFeedback = new EffectFeedbackFixture({
          id: uuid(),
          triggerAction: deleteFavoriteAction,
          message: 'Het item is uit jouw favorieten verwijderd.'
        });
        const effectFeedbackAction = new AddEffectFeedback({ effectFeedback });

        expectInAndOut(
          effects.deleteFavorite$,
          deleteFavoriteAction,
          effectFeedbackAction
        );
      });
    });

    describe('when failed', () => {
      beforeEach(() => {
        mockServiceMethodError('deleteFavorite', 'Something went wrong.');
      });
      it('should dispatch an error feedback action', () => {
        const errorFeedback = EffectFeedback.generateErrorFeedback(
          uuid(),
          deleteFavoriteAction,
          'Het is niet gelukt om het item uit jouw favorieten te verwijderen.'
        );

        const effectFeedbackAction = new AddEffectFeedback({
          effectFeedback: errorFeedback
        });
        const undoAction = undo(deleteFavoriteAction);

        actions = hot('a', { a: deleteFavoriteAction });

        expect(effects.deleteFavorite$).toBeObservable(
          hot('(ab)', {
            a: undoAction,
            b: effectFeedbackAction
          })
        );
      });
    });
  });

  describe('updateFavorite$', () => {
    const updateFavoriteAction = new UpdateFavorite({
      userId: 1,
      favorite: { id: 2, changes: { name: 'bar' } },
      useCustomErrorHandler: true
    });
    const undoUpdateAction = undo(updateFavoriteAction);
    let successFeedbackAction: AddEffectFeedback;
    let errorFeedbackAction: AddEffectFeedback;
    beforeAll(() => {
      successFeedbackAction = new AddEffectFeedback({
        effectFeedback: EffectFeedback.generateSuccessFeedback(
          uuid(),
          updateFavoriteAction,
          'Je favoriet is gewijzigd.'
        )
      });
      errorFeedbackAction = new AddEffectFeedback({
        effectFeedback: EffectFeedback.generateErrorFeedback(
          uuid(),
          updateFavoriteAction,
          'Het is niet gelukt om je favoriet te wijzigen.'
        )
      });
    });

    it('should call favoriteService.updateFavorite and trigger feedback message on success', () => {
      mockServiceMethodReturnValue('updateFavorite', { id: 2, name: 'bar' });

      const spy = jest.spyOn(
        TestBed.get(FAVORITE_SERVICE_TOKEN),
        'updateFavorite'
      );

      expectInAndOut(
        effects.updateFavorite$,
        updateFavoriteAction,
        successFeedbackAction
      );

      expect(spy).toHaveBeenCalledWith(1, 2, { name: 'bar' });
    });

    it('should trigger an undo and feedback action on failure', () => {
      mockServiceMethodError('updateFavorite', 'Something went wrong!');

      actions = hot('a', { a: updateFavoriteAction });
      expect(effects.updateFavorite$).toBeObservable(
        hot('(ab)', {
          a: undoUpdateAction,
          b: errorFeedbackAction
        })
      );
    });
  });
});
