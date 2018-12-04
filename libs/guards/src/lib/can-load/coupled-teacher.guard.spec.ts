// file.only

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DalState,
  PersonFixture,
  StateFeatureBuilder,
  UserActions,
  UserReducer
} from '@campus/dal';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { CoupledTeacherGuard } from '.';

describe('coupledTeacherGuard', () => {
  let usedUserState: UserReducer.State;
  let coupledTeacherGuard: CoupledTeacherGuard;
  const spy = jest.fn();
  let store: Store<DalState>;

  class MockRouter {
    navigate = spy;
  }

  afterEach(() => {
    usedUserState = <UserReducer.State>{};
    jest.resetAllMocks();
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...StateFeatureBuilder.getStoreModuleForFeatures([UserReducer]),
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
  it('should return false with an initialState', () => {
    expect(coupledTeacherGuard.canLoad({})).toBeObservable(
      hot('a', { a: false })
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/login']);
  });
  it('should return false if the user has undefined teachers', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({ roles: [], teachers: undefined })
      )
    );
    expect(coupledTeacherGuard.canLoad({})).toBeObservable(
      hot('a', { a: false })
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/settings']);
  });
  it('should return false if the user has undefined roles', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({ roles: undefined, teachers: [new PersonFixture()] })
      )
    );
    expect(coupledTeacherGuard.canLoad({})).toBeObservable(
      hot('a', { a: false })
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/settings']);
  });
  it('should return false if the user has no roles and no teachers', () => {
    store.dispatch(
      new UserActions.UserLoaded(new PersonFixture({ roles: [], teachers: [] }))
    );
    expect(coupledTeacherGuard.canLoad({})).toBeObservable(
      hot('a', { a: false })
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/settings']);
  });
  it('should return false if the user is a teacher and has teachers', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({
          roles: [{ name: 'teacher' }],
          teachers: [new PersonFixture()]
        })
      )
    );
    expect(coupledTeacherGuard.canLoad({})).toBeObservable(
      hot('a', { a: false })
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/settings']);
  });
  it('should return false if the user is a teacher and a student and has teachers', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({
          roles: [{ name: 'teacher' }, { name: 'student' }],
          teachers: [new PersonFixture()]
        })
      )
    );
    expect(coupledTeacherGuard.canLoad({})).toBeObservable(
      hot('a', { a: false })
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/settings']);
  });
  it('should return true if the user is a student, not a teacher and has teachers', () => {
    store.dispatch(
      new UserActions.UserLoaded(
        new PersonFixture({
          roles: [{ name: 'student' }],
          teachers: [new PersonFixture()]
        })
      )
    );
    expect(coupledTeacherGuard.canLoad({})).toBeObservable(
      hot('a', { a: true })
    );
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
