import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';
import { Observable, of } from 'rxjs';
import { TaskInstanceReducer } from '.';
import { TASK_INSTANCE_SERVICE_TOKEN } from '../../tasks/task-instance.service.interface';
import {
  LoadTaskInstances,
  TaskInstancesLoaded,
  TaskInstancesLoadError
} from './task-instance.actions';
import { TaskInstanceEffects } from './task-instance.effects';

describe('TaskInstanceEffects', () => {
  let actions: Observable<any>;
  let effects: TaskInstanceEffects;
  let usedState: any;

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
    service: any = TASK_INSTANCE_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = TASK_INSTANCE_SERVICE_TOKEN
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
        StoreModule.forFeature(
          TaskInstanceReducer.NAME,
          TaskInstanceReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([TaskInstanceEffects])
      ],
      providers: [
        {
          provide: TASK_INSTANCE_SERVICE_TOKEN,
          useValue: {
            getAllForUser: () => {}
          }
        },
        TaskInstanceEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(TaskInstanceEffects);
  });

  describe('loadTaskInstance$', () => {
    const unforcedLoadAction = new LoadTaskInstances({ userId: 1 });
    const forcedLoadAction = new LoadTaskInstances({ force: true, userId: 1 });
    const filledLoadedAction = new TaskInstancesLoaded({ taskInstances: [] });
    const loadErrorAction = new TaskInstancesLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = TaskInstanceReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadTaskInstances$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadTaskInstances$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...TaskInstanceReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadTaskInstances$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadTaskInstances$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = TaskInstanceReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadTaskInstances$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadTaskInstances$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...TaskInstanceReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadTaskInstances$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadTaskInstances$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
});
