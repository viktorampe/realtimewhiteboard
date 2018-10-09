import { uiQuery } from './ui.selectors';

describe('Ui Selectors', () => {
  const ERROR_MSG = 'No Error Available';

  let storeState;

  beforeEach(() => {
    storeState = {
      ui: {
        error: ERROR_MSG,
        loaded: true
      }
    };
  });

  describe('Ui Selectors', () => {
    it('getAllUi() should return an object of type UIState', () => {
      const results = uiQuery.getAllUi(storeState);
      expect(results).toEqual(storeState.ui);
    });

    it('getAllUi() should return an empty object', () => {
      storeState.ui.loaded = false;
      const results = uiQuery.getAllUi(storeState);
      expect(results).toEqual({});
    });

    it("getLoaded() should return the current 'loaded' status", () => {
      const result = uiQuery.getLoaded(storeState);

      expect(result).toBe(true);
    });

    it("getError() should return the current 'error' storeState", () => {
      const result = uiQuery.getError(storeState);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
