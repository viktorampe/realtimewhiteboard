import { TestBed } from '@angular/core/testing';
import { Actions, EffectsModule } from '@ngrx/effects';
import { Action, Store, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import { from, of } from 'rxjs';
import { DalState } from '../+state';
import {
  AddEffectFeedback,
  DeleteEffectFeedback
} from '../+state/effect-feedback/effect-feedback.actions';
import { EffectFeedback, Priority } from '../..';
import { UndoService } from './undo.service';
import {
  UndoableActionInterface,
  UNDO_SERVICE_TOKEN
} from './undo.service.interface';

describe('UndoService', () => {
  let service: UndoService;
  let store: Store<DalState>;
  let uuid: Function;
  configureTestSuite(() => {
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
        EffectsModule.forRoot([])
      ],
      providers: [
        Store,
        { provide: UNDO_SERVICE_TOKEN, useClass: UndoService },
        {
          provide: 'uuid',
          useValue: (): string => 'foo'
        }
      ]
    });
    service = TestBed.get(UNDO_SERVICE_TOKEN);
    store = TestBed.get(Store);
    uuid = TestBed.get('uuid');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(store).toBeTruthy();
  });
  describe('undo', () => {
    it('should return undo action of passed action', () => {
      const action: Action = { type: 'some action' };
      expect(service.undo(action)).toEqual({
        type: 'ngrx-undo/UNDO_ACTION',
        payload: action
      });
    });
  });
  describe('dispatchActionAsUndoable', () => {
    let actions: Actions;
    let payload: UndoableActionInterface;
    let warningFeedback: EffectFeedback;

    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(1234567890);
      actions = from([]);
      payload = {
        action: { type: 'deleteAlertAction', payload: {} },
        dataPersistence: { store: store, actions: actions } as DataPersistence<
          DalState
        >,
        undoLabel: 'undo label',
        undoneLabel: 'undone label',
        doneLabel: 'done label',
        intendedSideEffect: of({ type: 'returnValue' })
      };
      warningFeedback = new EffectFeedback({
        id: uuid(),
        triggerAction: payload.action,
        message: payload.undoLabel,
        userActions: [
          { title: 'Annuleren', userAction: service.undo(payload.action) }
        ],
        type: 'success',
        priority: Priority.NORM
      });
    });

    it('should dispatch a AddEffectFeedback with the warning', () => {
      const storeSpy = jest.spyOn(store, 'dispatch');
      service.dispatchActionAsUndoable(payload);
      expect(storeSpy).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenCalledWith(
        new AddEffectFeedback({ effectFeedback: warningFeedback })
      );
    });
    it('should open a pipe on the dataPersistence actions', () => {
      const actionsSpy = jest.spyOn(actions, 'pipe');
      service.dispatchActionAsUndoable(payload);
      expect(actionsSpy).toHaveBeenCalledTimes(1);
    });
    it('should return a successMessage if datePersistence has a DeleteEffectFeedback actions without userAction', () => {
      const deleteEffectFeedback: DeleteEffectFeedback = new DeleteEffectFeedback(
        { id: 'foo' }
      );
      payload.dataPersistence.actions = from([deleteEffectFeedback]);
      const undoFeedback = new EffectFeedback({
        id: uuid(),
        triggerAction: payload.action,
        message: payload.doneLabel,
        userActions: null,
        type: 'success',
        priority: Priority.NORM
      });

      expect(service.dispatchActionAsUndoable(payload)).toBeObservable(
        hot('(a|)', {
          a: new AddEffectFeedback({
            effectFeedback: undoFeedback
          })
        })
      );
    });
    it('should return a successMessage if datePersistence has a DeleteEffectFeedback actions with userAction', () => {
      jest.spyOn(service, 'undo').mockReturnValue({
        type: 'ngrx-undo/UNDO_ACTION',
        payload: payload.action
      });
      const deleteEffectFeedback: DeleteEffectFeedback = new DeleteEffectFeedback(
        { id: 'foo', userAction: service.undo(payload.action) }
      );
      payload.dataPersistence.actions = from([deleteEffectFeedback]);
      const undoFeedback = new EffectFeedback({
        id: uuid(),
        triggerAction: payload.action,
        message: payload.undoneLabel,
        userActions: null,
        type: 'success',
        priority: Priority.NORM
      });

      expect(service.dispatchActionAsUndoable(payload)).toBeObservable(
        hot('(a|)', {
          a: new AddEffectFeedback({
            effectFeedback: undoFeedback
          })
        })
      );
    });
  });
});
