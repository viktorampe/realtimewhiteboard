import { UserQueries } from '.';

describe('User Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const lastUpdateMessage = {
    message: 'update succeeded',
    timeStamp: 1
  };
  const getUserId = it => it['id'];

  let storeState;

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

  beforeEach(() => {
    const createUser = (id: string, name = ''): any => ({
      id,
      name: name || `name-${id}`
    });
    storeState = {
      user: {
        currentUser: mockUser,
        lastUpdate: lastUpdateMessage,
        error: ERROR_MSG,
        loaded: true
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

    it("getUpdateMessage() should return the current 'lastUpdate' storeState", () => {
      const result = UserQueries.getUpdateMessage(storeState);
      expect(result).toBe(lastUpdateMessage);
    });
  });
});
