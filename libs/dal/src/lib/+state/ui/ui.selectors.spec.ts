import { ListFormat } from '@campus/ui';
import { uiQuery } from './ui.selectors';

describe('Ui Selectors', () => {
  const ERROR_MSG = 'No Error Available';

  let storeState;

  beforeEach(() => {
    storeState = {
      ui: {
        error: ERROR_MSG,
        loaded: true,
        listFormat: ListFormat.GRID
      }
    };
  });

  describe('Ui Selectors', () => {
    it("getLoaded() should return the current 'loaded' status", () => {
      const result = uiQuery.getLoaded(storeState);
      expect(result).toBe(true);
    });

    it("getListFormat() should return the current 'listFormat' setting", () => {
      const result = uiQuery.getListFormat(storeState);
      expect(result).toBe(ListFormat.GRID);
    });
  });
});
