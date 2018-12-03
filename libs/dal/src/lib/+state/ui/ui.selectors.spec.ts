import { ListFormat, NavItem } from '@campus/ui';
import { UiQuery } from './ui.selectors';

describe('Ui Selectors', () => {
  const ERROR_MSG = 'No Error Available';

  let storeState;
  let mockNavItem: NavItem;

  beforeAll(() => {
    mockNavItem = { title: 'mockNavItem' };
  });

  beforeEach(() => {
    storeState = {
      ui: {
        error: ERROR_MSG,
        loaded: true,
        listFormat: ListFormat.GRID,
        sideNavItems: [mockNavItem],
        profileMenuItems: [mockNavItem, mockNavItem]
      }
    };
  });

  describe('Ui Selectors', () => {
    it("getLoaded() should return the current 'loaded' status", () => {
      const result = UiQuery.getLoaded(storeState);
      expect(result).toBe(true);
    });

    it("getListFormat() should return the current 'listFormat' setting", () => {
      const result = UiQuery.getListFormat(storeState);
      expect(result).toBe(ListFormat.GRID);
    });

    it("getSideNavItems() should return the current 'sideNavItems' setting", () => {
      const result = UiQuery.getSideNavItems(storeState);
      expect(result).toEqual([mockNavItem]);
    });

    it("getProfileMenuItems() should return the current 'profileMenuItems' setting", () => {
      const result = UiQuery.getProfileMenuItems(storeState);
      expect(result).toEqual([mockNavItem, mockNavItem]);
    });
  });
});
