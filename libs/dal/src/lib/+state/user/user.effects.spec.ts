import { TestBed } from '@angular/core/testing';
import { MockDate } from '@campus/testing';
import { MapObjectConversionService } from '@campus/utils';
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
import { FAVORITE_SERVICE_TOKEN } from '../../favorite/favorite.service.interface';
import { AuthService } from '../../persons';
import { AUTH_SERVICE_TOKEN } from '../../persons/auth-service.interface';
import {
  PersonServiceInterface,
  PERSON_SERVICE_TOKEN
} from '../../persons/persons.service';
import {
  EffectFeedback,
  EffectFeedbackActions,
  Priority
} from '../effect-feedback';
import {
  LoadPermissions,
  LoadUser,
  PermissionsLoaded,
  RemoveUser,
  UpdateUser,
  UserLoaded,
  UserRemoved
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

const mockPermissions = ['permission-a', 'permission-b', 'permission-c'];

describe('UserEffects', () => {
  let actions: Observable<any>;
  let effects: UserEffects;
  let uuid: Function;

  const loadUserAction = new LoadUser({ force: true });
  const removeUserAction = new RemoveUser();
  const loadPermissionsAction = new LoadPermissions({ force: true });

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

  const jestMockTokenGetPermissionsReturnValue = () => {
    jest
      .spyOn(TestBed.get(AUTH_SERVICE_TOKEN), 'getPermissions')
      .mockReturnValue(of(mockPermissions));
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
        MapObjectConversionService,
        provideMockActions(() => actions),
        { provide: PERSON_SERVICE_TOKEN, useValue: {} },
        { provide: FAVORITE_SERVICE_TOKEN, useValue: {} },
        { provide: AUTH_SERVICE_TOKEN, useClass: AuthService },
        {
          provide: 'uuid',
          useValue: () => 'foo'
        }
      ]
    });
    effects = TestBed.get(UserEffects);
    uuid = TestBed.get('uuid');
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

  const expectInAndOutPermissions = (
    triggerAction: Action,
    effectOutput: any
  ) => {
    actions = hot('-a-|', { a: triggerAction });
    expect(effects.loadPermissions$).toBeObservable(
      hot('-a-|', {
        a: effectOutput
      })
    );
  };

  describe('loadUser$', () => {
    beforeEach(() => {
      jestMockTokenGetUserReturnValue();
    });
    it('should trigger getCurrent api call', () => {
      expectInAndOut(loadUserAction, new UserLoaded(mockUser));
    });
  });

  describe('removeUser$', () => {
    beforeEach(() => {
      jestMockTokenRemoveUserReturnValue();
    });
    it('should trigger logout', () => {
      expectInAndOutRemove(removeUserAction, new UserRemoved());
    });
  });

  describe('updateUser$', () => {
    let successMessageAction: Action;
    let errorMessageAction: Action;
    let personService: PersonServiceInterface;
    const changedProps: Partial<PersonInterface> = {
      firstName: 'new value',
      name: 'new value'
    };
    const updateAction = new UpdateUser({ userId: mockUser.id, changedProps });

    let baseState: UserReducer.State;

    beforeAll(() => {
      const dateMock = new MockDate();
      successMessageAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: new EffectFeedback({
          id: uuid(),
          timeStamp: dateMock.mockDate.getTime(),
          triggerAction: updateAction,
          message: 'Je gegevens zijn opgeslagen.'
        })
      });
      errorMessageAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: new EffectFeedback({
          id: uuid(),
          timeStamp: dateMock.mockDate.getTime(),
          triggerAction: updateAction,
          message: 'Het is niet gelukt om je gegevens te bewaren.',
          type: 'error',
          userActions: [
            {
              title: 'Opnieuw proberen.',
              userAction: updateAction
            }
          ],
          priority: Priority.HIGH
        })
      });
    });

    beforeEach(() => {
      baseState = {
        currentUser: mockUser,
        loaded: true,
        permissions: null,
        permissionsLoaded: null
      };
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

  describe('loadPermissions$', () => {
    beforeEach(() => {
      jestMockTokenGetPermissionsReturnValue();
    });
    it('should trigger getPermissions api call', () => {
      expectInAndOutPermissions(
        loadPermissionsAction,
        new PermissionsLoaded(mockPermissions)
      );
    });
  });
});
