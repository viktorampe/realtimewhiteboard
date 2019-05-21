import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { UndoService } from './undo.service';
import { UNDO_SERVICE_TOKEN } from './undo.service.interface';

describe('UndoService', () => {
  let service: UndoService;
  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UNDO_SERVICE_TOKEN, useClass: UndoService }]
    });
    service = TestBed.get(UNDO_SERVICE_TOKEN);
  });
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return undo action of passed action', () => {
    const action: Action = { type: 'some action' };
    expect(service.undo(action)).toEqual({
      type: 'ngrx-undo/UNDO_ACTION',
      payload: action
    });
  });
});
