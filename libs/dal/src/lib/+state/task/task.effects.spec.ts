import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { TaskReducer } from '.';
import { TaskFixture } from '../../+fixtures';
import {
  TaskServiceInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import { EffectFeedback, Priority } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  AddTask,
  LoadTasks,
  StartAddTask,
  TasksLoaded,
  TasksLoadError
} from './task.actions';
import { TaskEffects } from './task.effects';

describe('TaskEffects', () => {
  let actions: Observable<any>;
  let effects: TaskEffects;
  let usedState: any;
  let uuid: Function;
  let taskService: TaskServiceInterface;

  const mockDate = new MockDate();

  afterAll(() => {
    mockDate.returnRealDate();
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
            createTask: () => {}
          }
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

  describe('createTask$', () => {
    const taskToCreate = { name: 'foo' };
    const newTask = new TaskFixture();

    let createTaskSpy: jest.SpyInstance;
    beforeEach(() => {
      // TODO: don't avoid typescript
      createTaskSpy = taskService['createTask'] = jest.fn();
    });

    it('should call the service and dispatch an action to add the result to the store', () => {
      createTaskSpy.mockReturnValue(of(newTask));

      expectInAndOut(
        effects.startAddTask$,
        new StartAddTask({ task: taskToCreate }),
        new AddTask({ task: newTask })
      );

      expect(createTaskSpy).toHaveBeenCalledWith(taskToCreate);
    });

    it('should dispatch feedback on error', () => {
      createTaskSpy.mockRejectedValue(new Error('did not work'));

      const effectFeedback = new EffectFeedback({
        id: uuid(),
        triggerAction: new StartAddTask({ task: taskToCreate }),
        message: 'Het is niet gelukt om de taak te maken.',
        type: 'error',
        userActions: [
          {
            title: 'Opnieuw proberen',
            userAction: new StartAddTask({ task: taskToCreate })
          }
        ],
        priority: Priority.HIGH
      });
      const addFeedbackAction = new AddEffectFeedback({ effectFeedback });

      expectInAndOut(
        effects.startAddTask$,
        new StartAddTask({ task: taskToCreate }),
        addFeedbackAction
      );
    });
  });
});
