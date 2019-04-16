import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { TaskEduContentReducer } from '.';
import { EffectFeedbackFixture, TaskEduContentFixture } from '../../+fixtures';
import { TASK_EDU_CONTENT_SERVICE_TOKEN } from '../../tasks/task-edu-content.service.interface';
import { TASK_SERVICE_TOKEN } from '../../tasks/task.service.interface';
import {
  EffectFeedbackActions,
  EffectFeedbackInterface,
  Priority
} from '../effect-feedback';
import {
  AddTaskEduContent,
  LinkTaskEduContent,
  LoadTaskEduContents,
  TaskEduContentsLoaded,
  TaskEduContentsLoadError
} from './task-edu-content.actions';
import { TaskEduContentEffects } from './task-edu-content.effects';

describe('TaskEduContentEffects', () => {
  let actions: Observable<any>;
  let effects: TaskEduContentEffects;
  let usedState: any;
  let effectFeedback: EffectFeedbackInterface;
  let uuid: Function;
  let dateMock: MockDate;

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

  const mockTaskEduContentServiceMethodReturnValue = (
    method: string,
    returnValue: any,
    service: any = TASK_EDU_CONTENT_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockTaskEduContentServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = TASK_EDU_CONTENT_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockImplementation(() => {
      throw new Error(errorMessage);
    });
  };

  const mockTaskServiceMethodReturnValue = (
    method: string,
    returnValue: any,
    service: any = TASK_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockTaskServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = TASK_SERVICE_TOKEN
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

  afterAll(() => {
    dateMock.returnRealDate();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          TaskEduContentReducer.NAME,
          TaskEduContentReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([TaskEduContentEffects])
      ],
      providers: [
        {
          provide: TASK_EDU_CONTENT_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {}
          }
        },
        {
          provide: TASK_SERVICE_TOKEN,
          useValue: {
            linkEduContent: () => {}
          }
        },
        {
          provide: 'uuid',
          useValue: (): string => 'foo'
        },
        TaskEduContentEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(TaskEduContentEffects);
    uuid = TestBed.get('uuid');
    effectFeedback.id = uuid();
  });

  describe('loadTaskEduContent$', () => {
    const unforcedLoadAction = new LoadTaskEduContents({ userId: 1 });
    const forcedLoadAction = new LoadTaskEduContents({
      force: true,
      userId: 1
    });
    const filledLoadedAction = new TaskEduContentsLoaded({
      taskEduContents: []
    });
    const loadErrorAction = new TaskEduContentsLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = TaskEduContentReducer.initialState;
      });
      beforeEach(() => {
        mockTaskEduContentServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadTaskEduContents$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadTaskEduContents$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...TaskEduContentReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockTaskEduContentServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadTaskEduContents$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadTaskEduContents$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = TaskEduContentReducer.initialState;
      });
      beforeEach(() => {
        mockTaskEduContentServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadTaskEduContents$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadTaskEduContents$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...TaskEduContentReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockTaskEduContentServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadTaskEduContents$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadTaskEduContents$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
  describe('linkTaskEduContent$', () => {
    const linkAction = new LinkTaskEduContent({
      taskId: 1,
      eduContentId: 2,
      displayResponse: true
    });
    const linkedAction = new AddTaskEduContent({
      taskEduContent: new TaskEduContentFixture()
    });

    describe('with initialState', () => {
      beforeAll(() => {
        usedState = TaskEduContentReducer.initialState;
      });
      beforeEach(() => {
        mockTaskServiceMethodReturnValue(
          'linkEduContent',
          new TaskEduContentFixture()
        );
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(effects.linkTaskEduContent$, linkAction, linkedAction);
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = TaskEduContentReducer.initialState;
      });
      beforeEach(() => {
        mockTaskServiceMethodError('linkEduContent', 'error');
        effectFeedback.message =
          'Het is niet gelukt om het leermateriaal aan de taak toe te voegen.';
        effectFeedback.triggerAction = linkAction;
        effectFeedback.type = 'error';
        effectFeedback.userActions = [
          {
            title: 'Opnieuw proberen.',
            userAction: linkAction
          }
        ];
        effectFeedback.priority = Priority.HIGH;
      });
      it('should return a error action if force is not true', () => {
        const errorAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback: effectFeedback
        });
        expectInAndOut(effects.linkTaskEduContent$, linkAction, errorAction);
      });
    });
  });
});
