import { TestBed } from '@angular/core/testing';
import { Actions, EffectsModule } from '@ngrx/effects';
import { Action, Store, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { from, of } from 'rxjs';
import { DalState } from '../+state';
import { AddEffectFeedback } from '../+state/effect-feedback/effect-feedback.actions';
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
  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
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
  beforeEach(() => TestBed.configureTestingModule({}));

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
    it('should dispatch a AddEffectFeedback with the warning', () => {
      jest.spyOn(Date, 'now').mockReturnValue(1234567890);
      const storeSpy = jest.spyOn(store, 'dispatch');
      const actions: Actions = from([]);
      const payload: UndoableActionInterface = {
        action: { type: 'deleteAlertAction', payload: {} },
        dataPersistence: { store: store, actions: actions } as DataPersistence<
          DalState
        >,
        undoLabel: 'undo label',
        undoneLabel: 'undone label',
        doneLabel: 'done label',
        intendedAction: of('returnValue')
      };
      const warningFeedback = new EffectFeedback({
        id: uuid(),
        triggerAction: payload.action,
        message: payload.undoLabel,
        userActions: [
          { title: 'Annuleren', userAction: service.undo(payload.action) }
        ],
        type: 'success',
        priority: Priority.NORM
      });
      service.dispatchActionAsUndoable(payload);
      expect(storeSpy).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenCalledWith(
        new AddEffectFeedback({ effectFeedback: warningFeedback })
      );
    });
  });
});
