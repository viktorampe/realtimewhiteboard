import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Update } from '@ngrx/entity';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { undo } from 'ngrx-undo';
import { Observable, of } from 'rxjs';
import { StudentContentStatusReducer } from '.';
import { StudentContentStatusInterface } from '../../+models';
import { STUDENT_CONTENT_STATUS_SERVICE_TOKEN } from '../../student-content-status/student-content-status.service.interface';
import { ActionSuccessful } from '../dal.actions';
import {
  EffectFeedback,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  Priority
} from '../effect-feedback';
import {
  AddStudentContentStatus,
  LoadStudentContentStatuses,
  StudentContentStatusesLoaded,
  StudentContentStatusesLoadError,
  UpdateStudentContentStatus
} from './student-content-status.actions';
import { StudentContentStatusesEffects } from './student-content-status.effects';
// file.only
function createStudentContentStatus(
  id: number,
  personId: number
): StudentContentStatusInterface | any {
  return {
    id: id,
    personId: personId
  };
}

describe('StudentContentStatusEffects', () => {
  let actions: Observable<any>;
  let effects: StudentContentStatusesEffects;
  let usedState: any;
  let uuid: Function;
  let dateMock: MockDate;

  let feedbackErrorMessage: EffectFeedbackInterface;
  let feedbackSuccessMessage: EffectFeedbackInterface;
  let feedbackSuccessAction: EffectFeedbackActions.AddEffectFeedback;
  let feedbackErrorAction: EffectFeedbackActions.AddEffectFeedback;

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
    service: any = STUDENT_CONTENT_STATUS_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = STUDENT_CONTENT_STATUS_SERVICE_TOKEN
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
        StoreModule.forFeature(
          StudentContentStatusReducer.NAME,
          StudentContentStatusReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([StudentContentStatusesEffects])
      ],
      providers: [
        {
          provide: STUDENT_CONTENT_STATUS_SERVICE_TOKEN,
          useValue: {
            getAllByStudentId: () => {},
            addStudentContentStatus: () => {},
            updateStudentContentStatus: () => {}
          }
        },
        StudentContentStatusesEffects,
        DataPersistence,
        provideMockActions(() => actions),
        {
          provide: 'uuid',
          useValue: () => 'foo'
        }
      ]
    });

    effects = TestBed.get(StudentContentStatusesEffects);
    uuid = TestBed.get('uuid');
  });

  describe('loadStudentContentStatus$', () => {
    const unforcedLoadAction = new LoadStudentContentStatuses({ studentId: 1 });
    const forcedLoadAction = new LoadStudentContentStatuses({
      force: true,
      studentId: 1
    });
    const filledLoadedAction = new StudentContentStatusesLoaded({
      studentContentStatuses: []
    });
    const loadErrorAction = new StudentContentStatusesLoadError(
      new Error('failed')
    );
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = StudentContentStatusReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllByStudentId', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadStudentContentStatuses$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadStudentContentStatuses$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = {
          ...StudentContentStatusReducer.initialState,
          loaded: true
        };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getAllByStudentId', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadStudentContentStatuses$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadStudentContentStatuses$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = StudentContentStatusReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getAllByStudentId', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadStudentContentStatuses$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadStudentContentStatuses$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...StudentContentStatusReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getAllByStudentId', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadStudentContentStatuses$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadStudentContentStatuses$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
  describe('updateStudentContentStatus$', () => {
    const update: Update<StudentContentStatusInterface> = {
      id: 1,
      changes: {
        personId: 1
      }
    };
    const updateAction = new UpdateStudentContentStatus({
      studentContentStatus: update
    });

    describe('with initialState', () => {
      beforeAll(() => {
        usedState = StudentContentStatusReducer.initialState;
        dateMock = new MockDate(); // needed for effect feedback timestamp

        feedbackErrorMessage = new EffectFeedback({
          id: uuid(),
          triggerAction: updateAction,
          icon: null,
          message: 'Status kon niet worden aangepast.',
          type: 'error',
          userActions: [
            { title: 'Opnieuw proberen', userAction: updateAction }
          ],
          timeStamp: dateMock.mockDate.getTime(),
          display: true,
          priority: Priority.HIGH
        });

        feedbackSuccessMessage = new EffectFeedback({
          id: uuid(),
          triggerAction: updateAction,
          icon: null,
          message: 'Status is aangepast.',
          type: 'success',
          userActions: [],
          timeStamp: dateMock.mockDate.getTime(),
          display: true,
          priority: Priority.NORM
        });

        feedbackSuccessAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback: feedbackSuccessMessage
        });

        feedbackErrorAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback: feedbackErrorMessage
        });
      });
      afterAll(() => {
        dateMock.returnRealDate();
      });

      beforeEach(() => {
        mockServiceMethodReturnValue('updateStudentContentStatus', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.updateStudentContentStatus$,
          updateAction,
          feedbackSuccessAction
        );
      });

      describe('failed update', () => {
        beforeEach(() => {
          mockServiceMethodError('updateStudentContentStatus', 'update failed');
        });

        it('should dispatch an undo and feedback action', () => {
          const undoAction = undo(updateAction);

          actions = hot('-a-', { a: updateAction });
          expect(effects.updateStudentContentStatus$).toBeObservable(
            hot('-(ab)', {
              a: undoAction,
              b: feedbackErrorAction
            })
          );
        });
      });
    });
  });
  describe('addStudentContentStatus$', () => {
    const studentContentStatus = createStudentContentStatus(1, 1);
    const addAction = new AddStudentContentStatus({
      studentContentStatus
    });
    const successAction = new ActionSuccessful({
      successfulAction: addAction.type
    });
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = StudentContentStatusReducer.initialState;
        dateMock = new MockDate(); // needed for effect feedback timestamp

        feedbackErrorMessage = new EffectFeedback({
          id: uuid(),
          triggerAction: addAction,
          icon: null,
          message: 'Status kon niet worden toegevoegd.',
          type: 'error',
          userActions: [{ title: 'Opnieuw proberen', userAction: addAction }],
          timeStamp: dateMock.mockDate.getTime(),
          display: true,
          priority: Priority.HIGH
        });

        feedbackSuccessMessage = new EffectFeedback({
          id: uuid(),
          triggerAction: addAction,
          icon: null,
          message: 'Status is toegevoegd.',
          type: 'success',
          userActions: [],
          timeStamp: dateMock.mockDate.getTime(),
          display: true,
          priority: Priority.NORM
        });

        feedbackSuccessAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback: feedbackSuccessMessage
        });

        feedbackErrorAction = new EffectFeedbackActions.AddEffectFeedback({
          effectFeedback: feedbackErrorMessage
        });
      });
      afterAll(() => {
        dateMock.returnRealDate();
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('addStudentContentStatus', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.addStudentContentStatuses$,
          addAction,
          feedbackSuccessAction
        );
      });

      it('should return an undo and feedback action when the api call errors', () => {
        mockServiceMethodError(
          'addStudentContentStatus',
          'Something went wrong!'
        );
        const undoAction = undo(addAction);

        actions = hot('-a-', { a: addAction });
        expect(effects.addStudentContentStatuses$).toBeObservable(
          hot('-(ab)', {
            a: undoAction,
            b: feedbackErrorAction
          })
        );
      });
    });
  });
});
