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
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  AddFavorite,
  AddFavoriteSuccess,
  DeleteFavorite,
  FavoritesLoaded,
  FavoritesLoadError,
  LoadFavorites,
  ToggleFavorite
} from './favorite.actions';
import { FavoriteEffects } from './favorite.effects';

// file.only
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
            deleteFavorite: () => {}
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

  beforeAll(() => {
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
      type: FavoriteTypesEnum.area,
      created: new Date()
    };
    const toggleFavoriteAction = new ToggleFavorite({
      favorite
    });
    const addFavoriteAction = new AddFavorite({ favorite });
    const deleteFavoriteAction = new DeleteFavorite({ id: favorite.id });
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
          addFavoriteAction
        );
      });
    });
  });

  describe('addFavorite$', () => {
    const favorite = {
      id: 123,
      type: FavoriteTypesEnum.area,
      created: new Date()
    };

    const addFavoriteAction = new AddFavorite({ favorite });
    const addFavoriteSuccess = new AddFavoriteSuccess({ favorite });

    describe('when succesful', () => {
      beforeAll(() => {
        usedState = FavoriteReducer.initialState;
      });

      beforeEach(() => {
        mockServiceMethodReturnValue('addFavorite', favorite);
      });
      it('should dispatch an addFavoriteSuccess action', () => {
        expectInAndOut(
          effects.addFavorite$,
          addFavoriteAction,
          addFavoriteSuccess
        );
      });
    });

    describe('when failed', () => {
      let effectFeedback: EffectFeedback;
      let addFeedbackAction: EffectFeedbackActions.AddEffectFeedback;
      const dateMock = new MockDate();
      beforeAll(() => {
        effectFeedback = new EffectFeedback({
          id: uuid(),
          triggerAction: addFavoriteAction,
          message:
            'Het is niet gelukt om het item aan jouw favorieten toe te voegen.',
          type: 'error',
          userActions: [
            { title: 'Opnieuw proberen', userAction: addFavoriteAction }
          ],
          display: true,
          priority: Priority.HIGH
        });
        addFeedbackAction = new AddEffectFeedback({ effectFeedback });
        usedState = FavoriteReducer.initialState;
      });
      afterAll(() => {
        dateMock.returnRealDate();
      });

      beforeEach(() => {
        mockServiceMethodError('addFavorite', 'Something went wrong.');
      });
      it('should dispatch an error feedback action', () => {
        expectInAndOut(
          effects.addFavorite$,
          addFavoriteAction,
          addFeedbackAction
        );
      });
    });
  });

  describe('deleteFavorite$', () => {
    let dateMock: MockDate;
    beforeAll(() => {
      dateMock = new MockDate();
    });
    afterAll(() => {
      dateMock.returnRealDate();
    });

    describe('when successful', () => {
      beforeEach(() => {
        mockServiceMethodReturnValue('deleteFavorite', true);
      });
      it('should dispatch a success feedback action', () => {
        const deleteFavoriteAction = new DeleteFavorite({ id: 113 });
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
      it('should dispatch an undo and error feedback action', () => {
        const deleteFavoriteAction = new DeleteFavorite({ id: 113 });
        const effectFeedback = new EffectFeedbackFixture({
          id: uuid(),
          triggerAction: deleteFavoriteAction,
          message:
            'Het is niet gelukt om het item uit jouw favorieten te verwijderen.',
          type: 'error',
          priority: Priority.HIGH,
          userActions: [
            { title: 'Opnieuw proberen', userAction: deleteFavoriteAction }
          ]
        });
        const effectFeedbackAction = new AddEffectFeedback({ effectFeedback });
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
});
