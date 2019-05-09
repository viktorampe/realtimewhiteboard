import { TestBed } from '@angular/core/testing';
import {
  BundleReducer,
  DalState,
  EffectFeedback,
  PersonFixture,
  TaskReducer
} from '@campus/dal';
import { MockDate } from '@campus/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';
import { Observable, of } from 'rxjs';
import { TeacherStudentReducer } from '.';
import { TaskFixture, TeacherStudentFixture } from '../../+fixtures';
import { LINKED_PERSON_SERVICE_TOKEN } from '../../persons/linked-persons.service';
import { Priority } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  AddLinkedPerson,
  DeleteLinkedPerson
} from '../linked-person/linked-person.actions';
import { TasksLoaded } from '../task/task.actions';
import { UserReducer } from '../user';
import { UserLoaded } from '../user/user.actions';
import { BundleFixture } from './../../+fixtures/Bundle.fixture';
import { LinkedPersonServiceInterface } from './../../persons/linked-persons.service';
import { BundlesLoaded } from './../bundle/bundle.actions';
import {
  DeleteTeacherStudent,
  LinkTeacherStudent,
  LoadTeacherStudents,
  TeacherStudentsLoaded,
  TeacherStudentsLoadError,
  UnlinkTeacherStudent
} from './teacher-student.actions';
import { TeacherStudentEffects } from './teacher-student.effects';

describe('TeacherStudentsEffects', () => {
  let actions: Observable<any>;
  let effects: TeacherStudentEffects;
  let usedState: any;
  let uuid: Function;

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
        StoreModule.forFeature(BundleReducer.NAME, BundleReducer.reducer),
        StoreModule.forFeature(TaskReducer.NAME, TaskReducer.reducer),
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
        provideMockActions(() => actions),
        { provide: 'uuid', useValue: () => 'foo' }
      ]
    });

    effects = TestBed.get(TeacherStudentEffects);
    uuid = TestBed.get('uuid');
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
    const mockTeacherStudent = new TeacherStudentFixture({
      id: 12345,
      teacherId: mockTeacher.id,
      studentId: mockCurrentUser.id
    });

    beforeEach(() => {
      linkedPersonService = TestBed.get(LINKED_PERSON_SERVICE_TOKEN);
      store = TestBed.get(Store);
      store.dispatch(new UserLoaded(mockCurrentUser));
    });

    describe('linkTeacher$', () => {
      const linkTeacherAction = new LinkTeacherStudent({
        publicKey: mockPublicKey,
        userId: mockCurrentUser.id,
        useCustomErrorHandler: true
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
        const dateMock = new MockDate();

        linkedPersonService.linkStudentToTeacher = jest
          .fn()
          .mockReturnValue(of([mockTeacher]));

        actions = hot('-a-', { a: linkTeacherAction });

        const expectedActions$ = hot('-(abc)', {
          a: new AddLinkedPerson({ person: mockTeacher }),
          b: new LoadTeacherStudents({
            userId: mockCurrentUser.id,
            force: true
          }),
          c: new AddEffectFeedback({
            effectFeedback: EffectFeedback.generateSuccessFeedback(
              uuid(),
              linkTeacherAction,
              'Leerkracht is gekoppeld.'
            )
          })
        });

        expect(effects.linkTeacher$).toBeObservable(expectedActions$);

        dateMock.returnRealDate();
      });

      it('should dispatch a message action on an api error', () => {
        const dateMock = new MockDate();
        const errorMessage =
          'Het is niet gelukt om de leerkracht te ontkoppelen.';
        linkedPersonService.linkStudentToTeacher = jest
          .fn()
          .mockImplementation(() => {
            throw new Error(errorMessage);
          });
        actions = hot('-a-', { a: linkTeacherAction });

        const expectedAction$ = hot('-a', {
          a: new AddEffectFeedback({
            effectFeedback: EffectFeedback.generateErrorFeedback(
              uuid(),
              linkTeacherAction,
              'Het is niet gelukt om de leerkracht te ontkoppelen.'
            )
          })
        });

        expect(effects.linkTeacher$).toBeObservable(expectedAction$);
        dateMock.returnRealDate();
      });
    });

    describe('unlinkTeacher$', () => {
      const unlinkTeacherAction = new UnlinkTeacherStudent({
        teacherId: mockTeacher.id,
        userId: mockCurrentUser.id
      });
      const mockBundle = new BundleFixture({
        id: 1234,
        teacherId: mockTeacher.id
      });
      const mockTask = new TaskFixture({ id: 5678, personId: mockTeacher.id });

      beforeEach(() => {
        store.dispatch(
          new TeacherStudentsLoaded({ teacherStudents: [mockTeacherStudent] })
        );
        store.dispatch(new BundlesLoaded({ bundles: [mockBundle] }));
        store.dispatch(new TasksLoaded({ tasks: [mockTask] }));
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

      it('should dispatch actions', () => {
        const dateMock = new MockDate();
        linkedPersonService.unlinkStudentFromTeacher = jest
          .fn()
          .mockReturnValue(of(true));

        actions = hot('-a-', { a: unlinkTeacherAction });

        const expectedActions$ = hot('-(abc)', {
          a: new DeleteLinkedPerson({ id: mockTeacher.id }),
          b: new DeleteTeacherStudent({ id: mockTeacherStudent.id }),
          c: new AddEffectFeedback({
            effectFeedback: new EffectFeedback({
              id: uuid(),
              triggerAction: unlinkTeacherAction,
              message: 'Leerkracht is ontkoppeld.'
            })
          })
        });

        expect(effects.unlinkTeacher$).toBeObservable(expectedActions$);
        dateMock.returnRealDate();
      });

      it('should dispatch a message action on an api error', () => {
        const dateMock = new MockDate();
        const errorMessage = 'This error is your fault, not mine';
        linkedPersonService.unlinkStudentFromTeacher = jest
          .fn()
          .mockImplementation(() => {
            throw new Error(errorMessage);
          });

        actions = hot('-a-', { a: unlinkTeacherAction });

        const expectedAction$ = hot('-a', {
          a: new AddEffectFeedback({
            effectFeedback: new EffectFeedback({
              id: uuid(),
              triggerAction: unlinkTeacherAction,
              message: 'Het is niet gelukt om de leerkracht te ontkoppelen.',
              userActions: [
                { title: 'Probeer opnieuw', userAction: unlinkTeacherAction }
              ],
              type: 'error',
              priority: Priority.HIGH
            })
          })
        });

        expect(effects.unlinkTeacher$).toBeObservable(expectedAction$);
        dateMock.returnRealDate();
      });
    });
  });
});
