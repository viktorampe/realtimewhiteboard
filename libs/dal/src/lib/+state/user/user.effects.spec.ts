import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { cold, hot } from '@nrwl/nx/testing';
import { undo } from 'ngrx-undo';
import { Observable, of } from 'rxjs';
import { UserReducer } from '.';
import { PersonInterface } from '../../+models';
import { DalModule } from '../../dal.module';
import { AUTH_SERVICE_TOKEN } from '../../persons/auth-service.interface';
import {
  PersonServiceInterface,
  PERSON_SERVICE_TOKEN
} from '../../persons/persons.service';
import {
  LoadUser,
  RemoveUser,
  UpdateUser,
  UserLoaded,
  UserRemoved,
  UserUpdateMessage
} from './user.actions';
import { UserEffects } from './user.effects';

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
  let baseState: UserReducer.State;

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
        provideMockActions(() => actions),
        { provide: PERSON_SERVICE_TOKEN, useValue: {} }
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
      baseState = UserReducer.initialState;
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

  describe('updateUser$', () => {
    let personService: PersonServiceInterface;
    const changedProps: Partial<PersonInterface> = {
      firstName: 'new value',
      name: 'new value'
    };
    const mockDate = Date.now();
    const updateAction = new UpdateUser({ userId: mockUser.id, changedProps });
    const successMessageAction = new UserUpdateMessage({
      message: 'User updated',
      timeStamp: mockDate,
      type: 'success'
    });
    const errorMessageAction = new UserUpdateMessage({
      message: 'User update failed',
      timeStamp: mockDate,
      type: 'error'
    });

    let realDateImplementation;

    beforeAll(() => {
      // override date implementation
      realDateImplementation = Date.now.bind(global.Date);
      global.Date.now = jest.fn(() => mockDate);
    });

    afterAll(() => {
      // put original date implementation back
      global.Date.now = realDateImplementation;
    });

    beforeEach(() => {
      baseState = { currentUser: mockUser, loaded: true };
      personService = TestBed.get(PERSON_SERVICE_TOKEN);
    });

    it('should call the personService', () => {
      personService.updateUser = jest.fn();

      actions = hot('a', { a: updateAction });

      effects.updateUser$.subscribe(_ => {
        expect(personService.updateUser).toHaveBeenCalledTimes(1);
        expect(personService.updateUser).toHaveBeenCalledWith(
          updateAction.payload.userId,
          updateAction.payload.changedProps
        );
      });
    });

    it('should dispatch a message action on an update success', () => {
      personService.updateUser = jest
        .fn()
        .mockReturnValue(cold('a', { a: true }));

      actions = hot('a', { a: updateAction });

      expect(effects.updateUser$).toBeObservable(
        hot('a', {
          a: successMessageAction
        })
      );
    });

    it('should dispatch an undo action and a message action when the update fails', () => {
      personService.updateUser = jest
        .fn()
        .mockReturnValue(hot('#', new Error('this has failed spectacularly')));

      actions = hot('a', { a: updateAction });

      expect(effects.updateUser$).toBeObservable(
        hot('(ab)', {
          a: undo(updateAction),
          b: errorMessageAction
        })
      );
    });
  });
});
