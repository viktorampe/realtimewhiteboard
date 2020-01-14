import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Update } from '@ngrx/entity';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { undo } from 'ngrx-undo';
import { Observable, of } from 'rxjs';
import { TaskReducer } from '.';
import { TaskInterface } from '../../+models';
import {
  TaskServiceInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import {
  UndoService,
  UndoServiceInterface,
  UNDO_SERVICE_TOKEN
} from '../../undo';
import { EffectFeedback } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  LoadTasks,
  TasksLoaded,
  TasksLoadError,
  UpdateTasks
} from './task.actions';
import { TaskEffects } from './task.effects';

describe('TaskEffects', () => {
  let actions: Observable<any>;
  let effects: TaskEffects;
  let usedState: any;
  let uuid: Function;
  let taskService: TaskServiceInterface;
  let undoService: UndoServiceInterface;
  let dateMock: MockDate = new MockDate();

  afterAll(() => {
    dateMock.returnRealDate();
  });

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
    service: any = TASK_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = TASK_SERVICE_TOKEN
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
        StoreModule.forFeature(TaskReducer.NAME, TaskReducer.reducer, {
          initialState: usedState
        }),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([TaskEffects])
      ],
      providers: [
        {
          provide: TASK_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            updateTasks: () => {}
          }
        },
        {
          provide: UNDO_SERVICE_TOKEN,
          useClass: UndoService
        },
        TaskEffects,
        DataPersistence,
        provideMockActions(() => actions),
        {
          provide: 'uuid',
          useValue: () => '123-totally-a-uuid-123'
        }
      ]
    });

    effects = TestBed.get(TaskEffects);
    uuid = TestBed.get('uuid');
    taskService = TestBed.get(TASK_SERVICE_TOKEN);
    undoService = TestBed.get(UNDO_SERVICE_TOKEN);
  });

  describe('loadTask$', () => {
    const unforcedLoadAction = new LoadTasks({ userId: 1 });
    const forcedLoadAction = new LoadTasks({ force: true, userId: 1 });
    const filledLoadedAction = new TasksLoaded({ tasks: [] });
    const loadErrorAction = new TasksLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = TaskReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadTasks$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadTasks$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...TaskReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadTasks$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadTasks$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = TaskReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(effects.loadTasks$, unforcedLoadAction, loadErrorAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(effects.loadTasks$, forcedLoadAction, loadErrorAction);
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...TaskReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadTasks$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(effects.loadTasks$, forcedLoadAction, loadErrorAction);
      });
    });
  });

  //file.only
  describe('updateTasks$', () => {
    const tasksToUpdate: Update<TaskInterface>[] = [
      { id: 1, changes: { id: 1, name: 'Taak 1' } },
      { id: 2, changes: { id: 2, name: 'Taak 2' } }
    ];
    const updateAction = new UpdateTasks({ tasks: tasksToUpdate });
    const updateUndoAction = undo(updateAction);

    describe('when success', () => {
      beforeEach(() => {
        mockServiceMethodReturnValue('updateTasks', []);
      });

      it('should trigger an api call', () => {});
    });

    describe('when errored', () => {
      beforeEach(() => {
        mockServiceMethodError('updateTasks', 'failed');
      });
      it('should return an undo and feedback action', () => {
        const feedbackAction = new AddEffectFeedback({
          effectFeedback: EffectFeedback.generateErrorFeedback(
            uuid(),
            updateAction,
            'Het is niet gelukt om de taken te updaten.'
          )
        });
        actions = hot('a', { a: updateAction });
        expect(effects.updateTasks$).toBeObservable(
          hot('(ab)', {
            a: updateUndoAction,
            b: feedbackAction
          })
        );
      });
    });
  });
});
