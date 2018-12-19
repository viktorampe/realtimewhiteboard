import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DalState,
  LinkedPersonActions,
  LinkedPersonFixture,
  LinkedPersonReducer,
  PersonActions,
  PersonFixture,
  PersonReducer,
  StateFeatureBuilder,
  UserActions,
  UserReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { CoupledTeacherGuard } from '.';

describe('coupledTeacherGuard', () => {
  let coupledTeacherGuard: CoupledTeacherGuard;
  const spy = jest.fn();
  let store: Store<DalState>;
  class MockRouter {
    navigate = spy;
  }

  afterEach(() => {
    jest.resetAllMocks();
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...StateFeatureBuilder.getStoreModuleForFeatures([
          UserReducer,
          LinkedPersonReducer,
          PersonReducer
        ]),
        RouterTestingModule
      ],
      providers: [
        CoupledTeacherGuard,
        Store,
        { provide: Router, useClass: MockRouter }
      ]
    });
    coupledTeacherGuard = TestBed.get(CoupledTeacherGuard);
    store = TestBed.get(Store);
  });
  it('should not return anything with an initialState', () => {
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot(''));
    expect(spy).toHaveBeenCalledTimes(0);
  });
  it('should not return anything if the user is loaded but the linkedPersonsLoaded and personQueriesLoaded are false', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({ id: 1, roles: [{ name: 'student' }] })
      )
    );
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot(''));
    expect(spy).toHaveBeenCalledTimes(0);
  });
  it('should not return anything while linkedPersonsLoaded stays false', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({ id: 1, roles: [{ name: 'student' }] })
      )
    );
    store.dispatch(new PersonActions.PersonsLoaded({ persons: [] }));
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot(''));
    expect(spy).toHaveBeenCalledTimes(0);
  });
  it('should not return anything while personQueriesLoaded stays false', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({ id: 1, roles: [{ name: 'student' }] })
      )
    );
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({ linkedPersons: [] })
    );
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot(''));
    expect(spy).toHaveBeenCalledTimes(0);
  });
  it('should return false if the user has undefined roles', () => {
    store.dispatch(
      new UserActions.UserLoaded(new PersonFixture({ id: 1, roles: undefined }))
    );
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({ linkedPersons: [] })
    );
    store.dispatch(new PersonActions.PersonsLoaded({ persons: [] }));
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: false }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/settings']);
  });
  it('should return false if the user has no roles', () => {
    store.dispatch(
      new UserActions.UserLoaded(new PersonFixture({ id: 1, roles: [] }))
    );
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({ linkedPersons: [] })
    );
    store.dispatch(new PersonActions.PersonsLoaded({ persons: [] }));
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: false }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/settings']);
  });
  it('should return false if the user is not a student', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({ id: 1, roles: [{ name: 'teacher' }] })
      )
    );
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({ linkedPersons: [] })
    );
    store.dispatch(new PersonActions.PersonsLoaded({ persons: [] }));
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: false }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/settings']);
  });
  it('should return false if the user is both a teacher and a student but has not coupled teachers', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({
          id: 1,
          roles: [{ name: 'teacher' }, { name: 'student' }]
        })
      )
    );
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({ linkedPersons: [] })
    );
    store.dispatch(new PersonActions.PersonsLoaded({ persons: [] }));
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: false }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/settings']);
  });
  it('should return true if the user is both a teacher and a student and has coupled teachers', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({
          id: 1,
          roles: [{ name: 'teacher' }, { name: 'student' }]
        })
      )
    );
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({
        linkedPersons: [
          new LinkedPersonFixture({ id: 1, teacherId: 100, studentId: 1 }),
          new LinkedPersonFixture({ id: 2, teacherId: 101, studentId: 1 })
        ]
      })
    );
    store.dispatch(
      new PersonActions.PersonsLoaded({
        persons: [
          new PersonFixture({ id: 100, type: 'teacher' }),
          new PersonFixture({ id: 101, type: 'teacher' })
        ]
      })
    );
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: true }));
    expect(spy).toHaveBeenCalledTimes(0);
  });
  it('should return false if the user is a student but has no linkedPersons', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({ id: 1, roles: [{ name: 'student' }] })
      )
    );
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({
        linkedPersons: []
      })
    );
    store.dispatch(
      new PersonActions.PersonsLoaded({
        persons: []
      })
    );
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: false }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/settings']);
  });
  it('should return false if the user is a student has linkedPersons, but those are not teachers', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({ id: 1, roles: [{ name: 'student' }] })
      )
    );
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({
        linkedPersons: [
          new LinkedPersonFixture({ id: 1, teacherId: 100, studentId: 1 }),
          new LinkedPersonFixture({ id: 2, teacherId: 101, studentId: 1 })
        ]
      })
    );
    store.dispatch(
      new PersonActions.PersonsLoaded({
        persons: [
          new PersonFixture({ id: 100, type: 'student' }),
          new PersonFixture({ id: 101, type: 'student' })
        ]
      })
    );
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: false }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/settings']);
  });
  it('should return true if the user is a student has linkedPersons, of which at least one is a teacher', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({ id: 1, roles: [{ name: 'student' }] })
      )
    );
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({
        linkedPersons: [
          new LinkedPersonFixture({ id: 1, teacherId: 100, studentId: 1 }),
          new LinkedPersonFixture({ id: 2, teacherId: 101, studentId: 1 })
        ]
      })
    );
    store.dispatch(
      new PersonActions.PersonsLoaded({
        persons: [
          new PersonFixture({ id: 100, type: 'student' }),
          new PersonFixture({ id: 101, type: 'teacher' })
        ]
      })
    );
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: true }));
    expect(spy).toHaveBeenCalledTimes(0);
  });
  it('should return true if the user is a student has linkedPersons, of which all are teachers', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({ id: 1, roles: [{ name: 'student' }] })
      )
    );
    store.dispatch(
      new LinkedPersonActions.LinkedPersonsLoaded({
        linkedPersons: [
          new LinkedPersonFixture({ id: 1, teacherId: 100, studentId: 1 }),
          new LinkedPersonFixture({ id: 2, teacherId: 101, studentId: 1 })
        ]
      })
    );
    store.dispatch(
      new PersonActions.PersonsLoaded({
        persons: [
          new PersonFixture({ id: 100, type: 'teacher' }),
          new PersonFixture({ id: 101, type: 'teacher' })
        ]
      })
    );
    expect(
      coupledTeacherGuard.canActivate(
        <ActivatedRouteSnapshot>{},
        <RouterStateSnapshot>{}
      )
    ).toBeObservable(hot('a', { a: true }));
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
