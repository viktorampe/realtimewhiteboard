import { TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskClassGroupActions, TaskStudentActions } from '@campus/dal';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Update } from '@ngrx/entity';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { TaskReducer } from '.';
import {
  TaskClassGroupFixture,
  TaskFixture,
  TaskGroupFixture,
  TaskStudentFixture
} from '../../+fixtures';
import { TaskInterface } from '../../+models';
import {
  TaskServiceInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import { UndoService, UNDO_SERVICE_TOKEN } from '../../undo';
import { EffectFeedback, Priority } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import { TaskGroupActions } from '../task-group';
import {
  AddTask,
  DeleteTasks,
  LoadTasks,
  NavigateToTaskDetail,
  StartAddTask,
  StartArchiveTasks,
  StartDeleteTasks,
  TasksLoaded,
  TasksLoadError,
  UpdateAccess,
  UpdateTasks
} from './task.actions';
import { TaskEffects } from './task.effects';

describe('TaskEffects', () => {
  let actions: Observable<any>;
  let effects: TaskEffects;
  let usedState: any;
  let uuid: Function;
  let taskService: TaskServiceInterface;
  let router: Router;

  const mockDate = new MockDate(new Date('2020-1-14'));

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
        EffectsModule.forFeature([TaskEffects]),
        RouterTestingModule
      ],
      providers: [
        {
          provide: TASK_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {},
            updateTasks: () => {},
            deleteTasks: () => {},
            createTask: () => {},
            updateTask: () => {}
          }
        },
        {
          provide: UNDO_SERVICE_TOKEN,
          useClass: UndoService
        },
        { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
        TaskEffects,
        DataPersistence,
        provideMockActions(() => actions),
        {
          provide: 'uuid',
          useValue: () => '123-totally-a-uuid-123'
        }
      ]
    });

    const locale = TestBed.get(MAT_DATE_LOCALE);
    effects = TestBed.get(TaskEffects);
    uuid = TestBed.get('uuid');
    taskService = TestBed.get(TASK_SERVICE_TOKEN);
    router = TestBed.get(Router);
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
    const newTask = new TaskFixture(taskToCreate);
    const userId = 123;

    let createTaskSpy: jest.SpyInstance;
    beforeEach(() => {
      createTaskSpy = taskService.createTask = jest.fn();
    });

    it('should call the service and dispatch an action to add the result to the store', () => {
      createTaskSpy.mockReturnValue(of(newTask));

      expectInAndOut(
        effects.startAddTask$,
        new StartAddTask({
          task: taskToCreate,
          userId,
          navigateAfterCreate: false
        }),
        new AddTask({ task: newTask })
      );

      expect(createTaskSpy).toHaveBeenCalledWith(userId, taskToCreate);
    });

    it('should call the service and dispatch an action to add the result to the store and navigate', () => {
      createTaskSpy.mockReturnValue(of(newTask));

      actions = hot('a', {
        a: new StartAddTask({
          task: taskToCreate,
          userId,
          navigateAfterCreate: true
        })
      });

      expect(effects.startAddTask$).toBeObservable(
        hot('(ab)', {
          a: new AddTask({ task: newTask }),
          b: new NavigateToTaskDetail({ task: newTask })
        })
      );

      expect(createTaskSpy).toHaveBeenCalledWith(userId, taskToCreate);
    });

    it('should dispatch feedback on error', () => {
      createTaskSpy.mockRejectedValue(new Error('did not work'));

      const effectFeedback = new EffectFeedback({
        id: uuid(),
        triggerAction: new StartAddTask({ task: taskToCreate, userId }),
        message: 'Het is niet gelukt om de taak te maken.',
        type: 'error',
        userActions: [
          {
            title: 'Opnieuw proberen',
            userAction: new StartAddTask({ task: taskToCreate, userId })
          }
        ],
        priority: Priority.HIGH
      });
      const addFeedbackAction = new AddEffectFeedback({ effectFeedback });

      expectInAndOut(
        effects.startAddTask$,
        new StartAddTask({ task: taskToCreate, userId }),
        addFeedbackAction
      );
    });
  });

  describe('updateAccess$', () => {
    const taskId = 2;
    const userId = 123;

    const updatedTask: TaskInterface = new TaskFixture({
      id: taskId,
      taskClassGroups: [new TaskClassGroupFixture({ id: 1 })],
      taskGroups: [new TaskGroupFixture({ id: 1 })],
      taskStudents: [new TaskStudentFixture({ id: 1 })]
    });

    const updateAccessAction = new UpdateAccess({
      userId,
      taskId,
      taskGroups: updatedTask.taskGroups,
      taskStudents: updatedTask.taskStudents,
      taskClassGroups: updatedTask.taskClassGroups
    });

    const outPutActions = [
      TaskGroupActions.updateTaskGroupsAccess({
        taskId,
        taskGroups: updatedTask.taskGroups
      }),
      TaskClassGroupActions.updateTaskClassGroupsAccess({
        taskId: taskId,
        taskClassGroups: updatedTask.taskClassGroups
      }),
      TaskStudentActions.updateTaskStudentsAccess({
        taskId: taskId,
        taskStudents: updatedTask.taskStudents
      })
    ];

    let updateAccessSpy: jest.SpyInstance;

    beforeEach(() => {
      updateAccessSpy = taskService.updateAccess = jest.fn();
    });

    it('should call the service and dispatch actions to update the task students/groups/classgroups access', () => {
      updateAccessSpy.mockReturnValue(of(updatedTask));

      actions = hot('a', {
        a: updateAccessAction
      });

      expect(effects.updateAccess$).toBeObservable(
        hot('(abc)', {
          a: outPutActions[0],
          b: outPutActions[1],
          c: outPutActions[2]
        })
      );

      expect(updateAccessSpy).toHaveBeenCalledWith(
        userId,
        taskId,
        updatedTask.taskGroups,
        updatedTask.taskStudents,
        updatedTask.taskClassGroups
      );
    });

    it('should dispatch feedback on error', () => {
      updateAccessSpy.mockRejectedValue(new Error('Intruder alert!'));
      const effectFeedback = new EffectFeedback({
        id: uuid(),
        triggerAction: updateAccessAction,
        message: 'Het is niet gelukt om de taak toe te wijzen.',
        type: 'error',
        userActions: [
          {
            title: 'Opnieuw proberen',
            userAction: updateAccessAction
          }
        ],
        priority: Priority.HIGH
      });
      const addFeedbackAction = new AddEffectFeedback({ effectFeedback });
      expectInAndOut(
        effects.updateAccess$,
        updateAccessAction,
        addFeedbackAction
      );
    });
  });

  describe('NavigateToTaskDetail', () => {
    let navigateSpy: jest.SpyInstance;
    const id = 123;

    beforeEach(() => {
      navigateSpy = router.navigate = jest.fn();
    });

    it('should navigate', () => {
      actions = hot('a', {
        a: new NavigateToTaskDetail({ task: new TaskFixture({ id }) })
      });

      effects.redirectToTask$.subscribe(() => {
        expect(navigateSpy).toHaveBeenCalledWith(['tasks', 'manage', id]);
      });
    });
  });

  describe('deleteTasks$', () => {
    let deleteTasksSpy: jest.SpyInstance;
    const taskIds = [1, 2];
    const userId = 123;
    const triggerAction = new StartDeleteTasks({ userId, ids: taskIds });

    beforeEach(() => {
      deleteTasksSpy = taskService['deleteTasks'] = jest.fn();
    });
    it('should call the service and dispatch feedback, no errors', () => {
      deleteTasksSpy.mockReturnValue(
        of({ tasks: taskIds.map(id => ({ id })), errors: [] })
      );
      const expectedMessage = 'De taken werden verwijderd.';
      const deleteAction = new DeleteTasks({ ids: taskIds });
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
      expect(effects.deleteTasks$).toBeObservable(
        hot('(ab)', {
          a: deleteAction,
          b: feedbackAction
        })
      );
    });
    it('should call the service and dispatch feedback, only errors', () => {
      const taskDestroyErrors = [
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
      deleteTasksSpy.mockReturnValue(
        of({
          tasks: [],
          errors: taskDestroyErrors
        })
      );
      const expectedMessage = [
        '<p>Er werden geen taken verwijderd.</p>',
        '<p>De volgende taken zijn nog in gebruik:</p>',
        '<ul>',
        '<li><strong>Huiswerk</strong> is nog in gebruik door Hubert Stroganovski tot 1/14/2020.</li>',
        '<li><strong>Huiswerk2</strong> is nog in gebruik door Hubert Stroganovski tot 1/14/2020.</li>',
        '</ul>'
      ].join('');
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
      expect(effects.deleteTasks$).toBeObservable(
        hot('a', { a: feedbackAction })
      );
    });
    it('should call the service and dispatch feedback, mixed', () => {
      const taskDestroyErrors = [
        {
          task: 'Huiswerk',
          user: 'Hubert Stroganovski',
          activeUntil: new Date()
        }
      ];
      deleteTasksSpy.mockReturnValue(
        of({
          tasks: [{ id: 2 }],
          errors: taskDestroyErrors
        })
      );
      const deleteAction = new DeleteTasks({ ids: [2] });
      const expectedMessage = [
        '<p>De taak werd verwijderd.</p>',
        '<p>De volgende taken zijn nog in gebruik:</p>',
        '<ul>',
        '<li><strong>Huiswerk</strong> is nog in gebruik door Hubert Stroganovski tot 1/14/2020.</li>',
        '</ul>'
      ].join('');
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
      expect(effects.deleteTasks$).toBeObservable(
        hot('(ab)', { a: deleteAction, b: feedbackAction })
      );
    });
  });

  for (const verb of ['gearchiveerd', 'gedearchiveerd']) {
    describe('startArchiveTasks$', () => {
      const userId = 123;
      const archived = verb === 'gearchiveerd';
      const tasksToUpdate: Update<TaskInterface>[] = [
        { id: 1, changes: { id: 1, name: 'Taak 1', archived } },
        { id: 2, changes: { id: 2, name: 'Taak 2', archived } }
      ];
      const triggerAction = new StartArchiveTasks({
        userId,
        tasks: tasksToUpdate
      });

      it('should call the service and dispatch feedback, no errors', () => {
        mockServiceMethodReturnValue('updateTasks', {
          tasks: tasksToUpdate.map(task => task.changes),
          errors: []
        });

        const expectedMessage = `De taken werden ${verb}.`;

        const updateAction = new UpdateTasks({ userId, tasks: tasksToUpdate });
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
        expect(effects.startArchiveTasks$).toBeObservable(
          hot('(ab)', {
            a: updateAction,
            b: feedbackAction
          })
        );
      });
      it('should call the service and dispatch feedback for archiving, only errors', () => {
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
        const expectedMessage = [
          `<p>Er werden geen taken ${verb}.</p>`,
          '<p>De volgende taken zijn nog in gebruik:</p>',
          '<ul>',
          '<li><strong>Huiswerk</strong> is nog in gebruik door Hubert Stroganovski tot 1/14/2020.</li>',
          '<li><strong>Huiswerk2</strong> is nog in gebruik door Hubert Stroganovski tot 1/14/2020.</li>',
          '</ul>'
        ].join('');
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
        expect(effects.startArchiveTasks$).toBeObservable(
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
        const updateAction = new UpdateTasks({
          userId,
          tasks: tasksToUpdate.slice(1)
        });
        const expectedMessage =
          `<p>De taak werd ${verb}.</p>` +
          '<p>De volgende taken zijn nog in gebruik:</p>' +
          '<ul>' +
          '<li><strong>Huiswerk</strong> is nog in gebruik door Hubert Stroganovski tot 1/14/2020.</li>' +
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
        expect(effects.startArchiveTasks$).toBeObservable(
          hot('(ab)', { a: updateAction, b: feedbackAction })
        );
      });
    });
  }
});
