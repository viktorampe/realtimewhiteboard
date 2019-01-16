import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { TeacherStudentReducer } from '.';
import { LINKED_PERSON_SERVICE_TOKEN } from '../../persons/linked-persons.service';
import {
  LoadTeacherStudents,
  TeacherStudentsLoaded,
  TeacherStudentsLoadError
} from './teacher-student.actions';
import { TeacherStudentEffects } from './teacher-student.effects';

describe('TeacherStudentsEffects', () => {
  let actions: Observable<any>;
  let effects: TeacherStudentEffects;
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
    service: any = LINKED_PERSON_SERVICE_TOKEN
  ) => {
    jest.spyOn(TestBed.get(service), method).mockReturnValue(of(returnValue));
  };

  const mockServiceMethodError = (
    method: string,
    errorMessage: string,
    service: any = LINKED_PERSON_SERVICE_TOKEN
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
          TeacherStudentReducer.NAME,
          TeacherStudentReducer.reducer,
          {
            initialState: usedState
          }
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([TeacherStudentEffects])
      ],
      providers: [
        {
          provide: LINKED_PERSON_SERVICE_TOKEN,
          useValue: {
            getTeacherStudentsForUser: () => {}
          }
        },
        TeacherStudentEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(TeacherStudentEffects);
  });

  describe('loadTeacherStudents$', () => {
    const unforcedLoadAction = new LoadTeacherStudents({ userId: 1 });
    const forcedLoadAction = new LoadTeacherStudents({
      force: true,
      userId: 1
    });
    const filledLoadedAction = new TeacherStudentsLoaded({
      teacherStudents: []
    });
    const loadErrorAction = new TeacherStudentsLoadError(new Error('failed'));
    describe('with initialState', () => {
      beforeAll(() => {
        usedState = TeacherStudentReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getTeacherStudentsForUser', []);
      });
      it('should trigger an api call with the initialState if force is not true', () => {
        expectInAndOut(
          effects.loadTeacherStudents$,
          unforcedLoadAction,
          filledLoadedAction
        );
      });
      it('should trigger an api call with the initialState if force is true', () => {
        expectInAndOut(
          effects.loadTeacherStudents$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with loaded state', () => {
      beforeAll(() => {
        usedState = { ...TeacherStudentReducer.initialState, loaded: true };
      });
      beforeEach(() => {
        mockServiceMethodReturnValue('getTeacherStudentsForUser', []);
      });
      it('should not trigger an api call with the loaded state if force is not true', () => {
        expectInNoOut(effects.loadTeacherStudents$, unforcedLoadAction);
      });
      it('should trigger an api call with the loaded state if force is true', () => {
        expectInAndOut(
          effects.loadTeacherStudents$,
          forcedLoadAction,
          filledLoadedAction
        );
      });
    });
    describe('with initialState and failing api call', () => {
      beforeAll(() => {
        usedState = TeacherStudentReducer.initialState;
      });
      beforeEach(() => {
        mockServiceMethodError('getTeacherStudentsForUser', 'failed');
      });
      it('should return a error action if force is not true', () => {
        expectInAndOut(
          effects.loadTeacherStudents$,
          unforcedLoadAction,
          loadErrorAction
        );
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadTeacherStudents$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
    describe('with loaded and failing api call', () => {
      beforeAll(() => {
        usedState = {
          ...TeacherStudentReducer.initialState,
          loaded: true,
          list: []
        };
      });
      beforeEach(() => {
        mockServiceMethodError('getTeacherStudentsForUser', 'failed');
      });
      it('should return nothing action if force is not true', () => {
        expectInNoOut(effects.loadTeacherStudents$, unforcedLoadAction);
      });
      it('should return a error action if force is true', () => {
        expectInAndOut(
          effects.loadTeacherStudents$,
          forcedLoadAction,
          loadErrorAction
        );
      });
    });
  });
});
