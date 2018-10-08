import { Entity, UiState } from './ui.reducer';
import { uiQuery } from './ui.selectors';

describe('Ui Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getUiId = it => it['id'];

  let storeState;

  beforeEach(() => {
    const createUi = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
    storeState = {
      ui: {
        list: [
          createUi('PRODUCT-AAA'),
          createUi('PRODUCT-BBB'),
          createUi('PRODUCT-CCC')
        ],
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true
      }
    };
  });

  describe('Ui Selectors', () => {
    it('getAllUi() should return the list of Ui', () => {
      const results = uiQuery.getAllUi(storeState);
      const selId = getUiId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelectedUi() should return the selected Entity', () => {
      const result = uiQuery.getSelectedUi(storeState);
      const selId = getUiId(result);

      expect(selId).toBe('PRODUCT-BBB');
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
