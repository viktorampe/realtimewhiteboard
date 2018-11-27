import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
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

  class MockRouter {
    navigate = spy;
  }

  function stateTest(
    testName: string,
    testShould: string,
    userState: UserReducer.State,
    itFunction: Function
  ) {
    describe(testName, () => {
      beforeAll(() => {
        usedUserState = userState;
      });
      it(testShould, () => {
        itFunction();
      });
    });
  }

  afterEach(() => {
    usedUserState = <UserReducer.State>{};
    jest.resetAllMocks();
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...StateFeatureBuilder.getModuleWithForFeatureProviders([
          {
            NAME: UserReducer.NAME,
            reducer: UserReducer.reducer,
            initialState: {
              initialState: usedUserState
            }
          }
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
  });
  stateTest('guard', 'should be defined', UserReducer.initialState, () => {
    expect(coupledTeacherGuard).toBeDefined();
  });
  stateTest(
    'guard.canLoad',
    'should return false with an initialState',
    UserReducer.initialState,
    () => {
      expect(coupledTeacherGuard.canLoad({})).toBeObservable(
        hot('a', { a: false })
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(['/login']);
    }
  );
  stateTest(
    'guard.canLoad',
    'should return false if the user has undefined teachers',
    UserReducer.reducer(
      UserReducer.initialState,
      new UserActions.UserLoaded(
        new PersonFixture({ roles: [], teachers: undefined })
      )
    ),
    () => {
      expect(coupledTeacherGuard.canLoad({})).toBeObservable(
        hot('a', { a: false })
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(['/settings']);
    }
  );
  stateTest(
    'guard.canLoad',
    'should return false if the user has undefined roles',
    UserReducer.reducer(
      UserReducer.initialState,
      new UserActions.UserLoaded(
        new PersonFixture({ roles: undefined, teachers: [new PersonFixture()] })
      )
    ),
    () => {
      expect(coupledTeacherGuard.canLoad({})).toBeObservable(
        hot('a', { a: false })
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(['/settings']);
    }
  );
  stateTest(
    'guard.canLoad',
    'should return false if the user has no roles and no teachers',
    UserReducer.reducer(
      UserReducer.initialState,
      new UserActions.UserLoaded(new PersonFixture({ roles: [], teachers: [] }))
    ),
    () => {
      expect(coupledTeacherGuard.canLoad({})).toBeObservable(
        hot('a', { a: false })
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(['/settings']);
    }
  );
  stateTest(
    'guard.canLoad',
    'should return false if the user is a teacher and has teachers',
    UserReducer.reducer(
      UserReducer.initialState,
      new UserActions.UserLoaded(
        new PersonFixture({
          roles: [{ name: 'teacher' }],
          teachers: [new PersonFixture()]
        })
      )
    ),
    () => {
      expect(coupledTeacherGuard.canLoad({})).toBeObservable(
        hot('a', { a: false })
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(['/settings']);
    }
  );
  stateTest(
    'guard.canLoad',
    'should return false if the user is a teacher and a student and has teachers',
    UserReducer.reducer(
      UserReducer.initialState,
      new UserActions.UserLoaded(
        new PersonFixture({
          roles: [{ name: 'teacher' }, { name: 'student' }],
          teachers: [new PersonFixture()]
        })
      )
    ),
    () => {
      expect(coupledTeacherGuard.canLoad({})).toBeObservable(
        hot('a', { a: false })
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(['/settings']);
    }
  );
  stateTest(
    'guard.canLoad',
    'should return true if the user is and a student, not a teacher and has teachers',
    UserReducer.reducer(
      UserReducer.initialState,
      new UserActions.UserLoaded(
        new PersonFixture({
          roles: [{ name: 'student' }],
          teachers: [new PersonFixture()]
        })
      )
    ),
    () => {
      expect(coupledTeacherGuard.canLoad({})).toBeObservable(
        hot('a', { a: true })
      );
      expect(spy).toHaveBeenCalledTimes(0);
    }
  );
});
