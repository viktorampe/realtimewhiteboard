import { UserLoaded } from './user.actions';
import { initialUserstate, userReducer, UserState } from './user.reducer';

describe('User Reducer', () => {
  const getUserId = it => it['id'];
  let createUser;

  beforeEach(() => {
    createUser = (id: string, name = ''): any => ({
      id,
      name: name || `name-${id}`
    });
  });

  describe('valid User actions ', () => {
    it('should return set the list of known User', () => {
      const users = [createUser('PRODUCT-AAA'), createUser('PRODUCT-zzz')];
      const action = new UserLoaded(users);
      const result: UserState = userReducer(initialUserstate, action);
      const selId: string = getUserId(result.list[1]);
      expect(result.loaded).toBe(true);
      expect(result.list.length).toBe(2);
      expect(selId).toBe('PRODUCT-zzz');
    });
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = userReducer(initialUserstate, action);
      expect(result).toBe(initialUserstate);
    });
  });
});
