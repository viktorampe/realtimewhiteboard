import { TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Update } from '@ngrx/entity';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
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
import { EffectFeedback, Priority } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  LoadTasks,
  StartUpdateTasks,
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
  let dateMock: MockDate = new MockDate(new Date('2020-1-14'));

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
        { provide: MAT_DATE_LOCALE, useValue: 'nl-BE' },
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
  describe('startUpdateTasks$', () => {
    const tasksToUpdate: Update<TaskInterface>[] = [
      { id: 1, changes: { id: 1, name: 'Taak 1' } },
      { id: 2, changes: { id: 2, name: 'Taak 2' } }
    ];
    const triggerAction = new StartUpdateTasks({ tasks: tasksToUpdate });

    it('should call the service and dispatch feedback, no errors', () => {
      mockServiceMethodReturnValue('updateTasks', {
        tasks: tasksToUpdate.map(task => task.changes),
        errors: []
      });

      const expectedMessage = 'De taken werden opgeslagen.';
      const updateAction = new UpdateTasks({ tasks: tasksToUpdate });
      const feedbackAction = new AddEffectFeedback({
        effectFeedback: {
          id: uuid(),
          display: true,
          message: expectedMessage,
          timeStamp: Date.now(),
          triggerAction,
          priority: Priority.NORM,
          type: 'success',
          useDefaultCancel: true,
          userActions: []
        } as EffectFeedback
      });
      actions = hot('a', { a: triggerAction });
      expect(effects.startUpdateTasks$).toBeObservable(
        hot('(ab)', {
          a: updateAction,
          b: feedbackAction
        })
      );
    });
    it('should call the service and dispatch feedback, only errors', () => {
      const taskUpdateErrors = [
        {
          task: 'Huiswerk',
          user: 'Hubert Stroganovski',
          activeUntil: new Date()
        },
        {
          task: 'Huiswerk2',
          user: 'Hubert Stroganovski',
          activeUntil: new Date()
        }
      ];
      mockServiceMethodReturnValue('updateTasks', {
        tasks: [],
        errors: taskUpdateErrors
      });
      const expectedMessage =
        '<p>Er werden geen taken opgeslagen.</p>' +
        '<p>De volgende taken zijn nog in gebruik:</p>' +
        '<ul>' +
        '<li><strong>Huiswerk</strong> is nog in gebruik door Hubert Stroganovski tot 2020-1-14.</li>' +
        '<li><strong>Huiswerk2</strong> is nog in gebruik door Hubert Stroganovski tot 2020-1-14.</li>' +
        '</ul>';
      const feedbackAction = new AddEffectFeedback({
        effectFeedback: {
          id: uuid(),
          triggerAction,
          message: expectedMessage,
          type: 'error',
          userActions: [],
          priority: Priority.HIGH,
          display: true,
          timeStamp: Date.now(),
          useDefaultCancel: true
        }
      });
      actions = hot('a', { a: triggerAction });
      expect(effects.startUpdateTasks$).toBeObservable(
        hot('a', { a: feedbackAction })
      );
    });
    it('should call the service and dispatch feedback, mixed', () => {
      const taskUpdateErrors = [
        {
          task: 'Huiswerk',
          user: 'Hubert Stroganovski',
          activeUntil: new Date()
        }
      ];
      mockServiceMethodReturnValue('updateTasks', {
        tasks: tasksToUpdate.slice(1).map(task => task.changes),
        errors: taskUpdateErrors
      });
      const updateAction = new UpdateTasks({ tasks: tasksToUpdate.slice(1) });
      const expectedMessage =
        '<p>De taak werd opgeslagen.</p>' +
        '<p>De volgende taken zijn nog in gebruik:</p>' +
        '<ul>' +
        '<li><strong>Huiswerk</strong> is nog in gebruik door Hubert Stroganovski tot 2020-1-14.</li>' +
        '</ul>';
      const feedbackAction = new AddEffectFeedback({
        effectFeedback: {
          id: uuid(),
          triggerAction,
          message: expectedMessage,
          type: 'error',
          userActions: [],
          priority: Priority.HIGH,
          display: true,
          timeStamp: Date.now(),
          useDefaultCancel: true
        }
      });
      actions = hot('a', { a: triggerAction });
      expect(effects.startUpdateTasks$).toBeObservable(
        hot('(ab)', { a: updateAction, b: feedbackAction })
      );
    });
  });
});
