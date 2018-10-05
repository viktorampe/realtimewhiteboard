import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { DalModule } from '../../dal.module';
import { AuthServiceToken } from '../../persons/auth-service';
import { LoadUser, RemoveUser, UserLoaded, UserLoadError, UserRemoved, UserRemoveError } from './user.actions';
import { UserEffects } from './user.effects';
import { initialUserstate, UserState } from './user.reducer';

const mockUser = {
  name: 'Mertens',
  firstName: 'Tom',
  created: '2018-10-04T08:05:15.000Z',
  gender: null,
  type: 'teacher',
  avatar: null,
  email: 'teacher1@mailinator.com',
  currentSchoolYear: 2018,
  terms: true,
  realm: null,
  username: 'teacher1',
  emailVerified: true,
  id: 186,
  displayName: 'Tom Mertens',
  types: ['teacher'],
  completeProfile: {
    complete: true,
    checks: {
      schools: true,
      transition: { check: true, checkInfo: { schoolYear: 2018 } }
    }
  },
  personPreferences: [
    {
      key: 'ALTERNATIVE_PLATFORM_USAGE',
      value: 'homeschooling',
      id: 2,
      personId: 186
    },
    { key: 'RECEIVE_MESSAGES', value: '1', id: 3, personId: 186 },
    { key: 'REMEMBER_LOGIN', value: '1', id: 18, personId: 186 }
  ],
  teacherInfo: { publicKey: 'key-teacher1', id: 1, teacherId: 186 },
  roles: [{ name: 'teacher' }],
  coaccount: null
};

describe('UserEffects', () => {
  let actions: Observable<any>;
  let effects: UserEffects;
  let baseState: UserState;

  const loadUserAction = new LoadUser();
  const removeUserAction = new RemoveUser();
  const removeUserError = new UserRemoveError(new Error('error'));

  const jestMockTokenGetUserReturnValue = () => {
    jest
      .spyOn(TestBed.get(AuthServiceToken), 'getCurrent')
      .mockReturnValue(of(mockUser));
  };

  const jestMockTokenRemoveUserReturnValue = () => {
    jest
      .spyOn(TestBed.get(AuthServiceToken), 'logout')
      .mockReturnValue(of(true));
  };

  const jestMockTokenRemoveUserFail = () => {
    jest.spyOn(TestBed.get(AuthServiceToken), 'logout').mockReturnValue(
      Observable.create(ob => {
        ob.error(new Error(''));
      })
    );
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        DalModule.forRoot()
      ],
      providers: [
        UserEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });
    effects = TestBed.get(UserEffects);
  });

  const expectInAndOut = (triggerAction: Action, effectOutput: any) => {
    actions = hot('-a-|', { a: triggerAction });
    expect(effects.loadUser$).toBeObservable(
      hot('-a-|', {
        a: effectOutput
      })
    );
  };

  const expectInAndOutRemove = (triggerAction: Action, effectOutput: any) => {
    actions = hot('-a---|', { a: triggerAction });
    expect(effects.removedUser$).toBeObservable(
      hot('-a---|', {
        a: effectOutput
      })
    );
  };

  const expectInAndOutRemoveError = (
    triggerAction: Action,
    effectOutput: any
  ) => {
    actions = hot('-----|', { a: triggerAction });
    expect(effects.removedUser$).toBeObservable(
      hot('-----|', {
        a: effectOutput
      })
    );
  };

  describe('loadUser$', () => {
    beforeAll(() => {
      baseState = initialUserstate;
    });
    beforeEach(() => {
      jestMockTokenGetUserReturnValue();
    });
    it('should trigger getCurrent api call', () => {
      expectInAndOut(loadUserAction, new UserLoaded(mockUser));
    });
  });

  describe('removeUser$', () => {
    beforeAll(() => {
      baseState = { list: mockUser, loaded: true };
    });
    beforeEach(() => {
      jestMockTokenRemoveUserReturnValue();
    });
    it('should trigger logout', () => {
      expectInAndOutRemove(removeUserAction, new UserRemoved({}));
    });
  });

  describe('removeUser$', () => {
    beforeAll(() => {
      baseState = { list: mockUser, loaded: true };
    });
    beforeEach(() => {
      jestMockTokenRemoveUserFail();
    });
    it('should trigger logout failure', () => {
      expectInAndOutRemoveError(
        removeUserError,
        new UserRemoveError(new Error('error'))
      );
    });

    describe('loadUser$', () => {
      beforeAll(() => {
        baseState = initialUserstate;
      });
      beforeEach(() => {
        jestMockTokenRemoveUserFail();
      });
      it('should trigger load failure', () => {
        expectInAndOutRemoveError(
          removeUserError,
          new UserLoadError(new Error('error'))
        );
      });
  });
});
