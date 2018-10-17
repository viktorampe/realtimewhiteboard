import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Update } from '@ngrx/entity';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { StudentContentStatusInterface } from '../../+models';
import { STUDENT_CONTENT_STATUS_SERVICE_TOKEN } from '../../student-content-status/student-content-status.service.interface';
import { ActionSuccessful } from '../dal.actions';
import {
  AddStudentContentStatus,
  LoadStudentContentStatuses,
  StudentContentStatusesLoaded,
  StudentContentStatusesLoadError,
  UpdateStudentContentStatus
} from './student-content-status.actions';
import { StudentContentStatusesEffects } from './student-content-status.effects';
import { initialState, reducer } from './student-content-status.reducer';

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
        StoreModule.forFeature('studentContentStatuses', reducer, {
          initialState: usedState
        }),
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
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(StudentContentStatusesEffects);
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
        usedState = initialState;
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
        usedState = { ...initialState, loaded: true };
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
        usedState = initialState;
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
          ...initialState,
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
    const successAction = new ActionSuccessful({
      successfulAction: updateAction.type
    });
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('updateStudentContentStatus', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.updateStudentContentStatus$,
          updateAction,
          successAction
        );
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
        usedState = initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('addStudentContentStatus', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.addStudentContentStatuses$,
          addAction,
          successAction
        );
      });
    });
  });
});
