import { UserQueries } from '.';
import { DalState } from '..';

describe('User Selectors', () => {
  const ERROR_MSG = 'No Error Available';

  const getUserId = it => it['id'];

  let storeState: Partial<DalState>;

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

  beforeEach(() => {
    storeState = {
      user: {
        currentUser: mockUser,
        error: ERROR_MSG,
        loaded: true,
        permissions: mockPermissions,
        permissionsLoaded: true,
        permissionsError: null
      }
    };
  });

  describe('User Selectors', () => {
    it('getAllUser() should return the a User object', () => {
      const results = UserQueries.getCurrentUser(storeState);
      expect(results).toBe(mockUser);
    });

    it('getCurrentUser() should return the selected Entity', () => {
      const result = UserQueries.getCurrentUser(storeState);
      const selId = getUserId(result);
      expect(selId).toBe(186);
    });

    it("getLoaded() should return the current 'loaded' status", () => {
      const result = UserQueries.getLoaded(storeState);
      expect(result).toBe(true);
    });

    it("getError() should return the current 'error' storeState", () => {
      const result = UserQueries.getError(storeState);
      expect(result).toBe(ERROR_MSG);
    });

    it("getPermissions() should return the current 'permissions' storeState", () => {
      const result = UserQueries.getPermissions(storeState);
      expect(result).toBe(mockPermissions);
    });

    it("getPermissionsLoaded() should return the current 'permissionsLoaded' status", () => {
      const result = UserQueries.getPermissionsLoaded(storeState);
      expect(result).toBe(true);
    });
  });
});
