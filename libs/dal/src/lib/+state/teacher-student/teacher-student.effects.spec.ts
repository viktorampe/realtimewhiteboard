//file.only
import { TestBed } from '@angular/core/testing';
import { DalState, PersonFixture } from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { TeacherStudentReducer } from '.';
import { LINKED_PERSON_SERVICE_TOKEN } from '../../persons/linked-persons.service';
import { LoadBundles } from '../bundle/bundle.actions';
import { AddLinkedPerson } from '../linked-person/linked-person.actions';
import { LoadTasks } from '../task/task.actions';
import { UserReducer } from '../user';
import { UserLoaded } from '../user/user.actions';
import { LinkedPersonServiceInterface } from './../../persons/linked-persons.service';
import {
  AddTeacherStudent,
  LinkTeacherStudents,
  LoadTeacherStudents,
  TeacherStudentsLoaded,
  TeacherStudentsLoadError,
  UnlinkTeacherStudents
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
        StoreModule.forFeature(UserReducer.NAME, UserReducer.reducer),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([TeacherStudentEffects])
      ],
      providers: [
        {
          provide: LINKED_PERSON_SERVICE_TOKEN,
          useValue: {
            getTeacherStudentsForUser: () => {},
            linkStudentToTeacher: () => {},
            unlinkStudentFromTeacher: () => {}
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

  describe('link / unlink actions', () => {
    let linkedPersonService: LinkedPersonServiceInterface;
    let store: Store<DalState>;
    const mockPublicKey = 'SoylentGreenIsPeople!';
    const mockTeacher = new PersonFixture({
      id: 123,
      teacherInfo: { publicKey: mockPublicKey }
    });
    const mockCurrentUser = new PersonFixture();

    beforeEach(() => {
      linkedPersonService = TestBed.get(LINKED_PERSON_SERVICE_TOKEN);
      store = TestBed.get(Store);
      store.dispatch(new UserLoaded(mockCurrentUser));
    });

    describe('linkTeacher$', () => {
      const linkTeacherAction = new LinkTeacherStudents({
        publicKey: mockPublicKey
      });

      it('should call the linkedPersonService', () => {
        linkedPersonService.linkStudentToTeacher = jest.fn();

        actions = hot('-a-', { a: linkTeacherAction });

        effects.linkTeacher$.subscribe(_ => {
          expect(linkedPersonService.linkStudentToTeacher).toHaveBeenCalled();
          expect(linkedPersonService.linkStudentToTeacher).toHaveBeenCalledWith(
            mockPublicKey
          );
        });
      });

      it('should dispatch actions', () => {
        linkedPersonService = TestBed.get(LINKED_PERSON_SERVICE_TOKEN);
        linkedPersonService.linkStudentToTeacher = jest
          .fn()
          .mockReturnValue(of([mockTeacher]));

        actions = hot('-a-', { a: linkTeacherAction });

        const expectedActions$ = hot('-(abcd)', {
          a: new AddLinkedPerson({ person: mockTeacher }),
          b: new AddTeacherStudent({
            teacherStudent: {
              created: (jasmine.anything() as unknown) as Date, //partial matcher, effect uses new Date()
              teacherId: mockTeacher.id,
              studentId: mockCurrentUser.id
            }
          }),
          c: new LoadBundles({ userId: mockCurrentUser.id, force: true }),
          d: new LoadTasks({ userId: mockCurrentUser.id, force: true })
        });

        expect(effects.linkTeacher$).toBeObservable(expectedActions$);
      });
    });

    describe('unlinkTeacher$', () => {
      const unlinkTeacherAction = new UnlinkTeacherStudents({
        teacherId: mockTeacher.id
      });

      beforeEach(() => {
        linkedPersonService = TestBed.get(LINKED_PERSON_SERVICE_TOKEN);
        store = TestBed.get(Store);
        store.dispatch(new UserLoaded(mockCurrentUser));
      });

      it('should call the linkedPersonService', () => {
        linkedPersonService.unlinkStudentFromTeacher = jest.fn();

        actions = hot('-a-', { a: unlinkTeacherAction });

        effects.unlinkTeacher$.subscribe(_ => {
          expect(
            linkedPersonService.unlinkStudentFromTeacher
          ).toHaveBeenCalled();
          expect(
            linkedPersonService.unlinkStudentFromTeacher
          ).toHaveBeenCalledWith(mockCurrentUser.id, mockTeacher.id);
        });
      });
    });
  });
});
