import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { DalModule } from '../../dal.module';
import { AUTH_SERVICE_TOKEN } from '../../persons/auth-service.interface';
import { LoadUser, RemoveUser, UserLoaded, UserRemoved } from './user.actions';
import { UserEffects } from './user.effects';
import { initialUserstate, State } from './user.reducer';

const mockUser = {
  name: 'Mertens',
  firstName: 'Tom',
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
  let baseState: State;

  const loadUserAction = new LoadUser({ force: true });
  const removeUserAction = new RemoveUser();

  const jestMockTokenGetUserReturnValue = () => {
    jest
      .spyOn(TestBed.get(AUTH_SERVICE_TOKEN), 'getCurrent')
      .mockReturnValue(of(mockUser));
  };

  const jestMockTokenRemoveUserReturnValue = () => {
    jest
      .spyOn(TestBed.get(AUTH_SERVICE_TOKEN), 'logout')
      .mockReturnValue(of(true));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        DalModule.forRoot({ apiBaseUrl: '' })
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
      baseState = { currentUser: mockUser, loaded: true };
    });
    beforeEach(() => {
      jestMockTokenRemoveUserReturnValue();
    });
    it('should trigger logout', () => {
      expectInAndOutRemove(removeUserAction, new UserRemoved());
    });
  });
});
