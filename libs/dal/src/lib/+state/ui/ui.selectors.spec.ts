import {
  BreadcrumbLinkInterface,
  DropdownMenuItemInterface,
  ListFormat,
  NavItem
} from '../../+external-interfaces';
import { UiQuery } from './ui.selectors';

describe('Ui Selectors', () => {
  const ERROR_MSG = 'No Error Available';

  let storeState;
  let mockNavItem: NavItem;
  let mockProfileMenuItem: DropdownMenuItemInterface;
  let mockBreadcrumb: BreadcrumbLinkInterface;

  beforeAll(() => {
    mockNavItem = { title: 'mockNavItem' };
    mockProfileMenuItem = { description: 'mock' };
    mockBreadcrumb = { displayText: 'foo', link: ['url'] };
  });

  beforeEach(() => {
    storeState = {
      ui: {
        error: ERROR_MSG,
        loaded: true,
        listFormat: ListFormat.GRID,
        sideNavItems: [mockNavItem],
        profileMenuItems: [mockProfileMenuItem],
        breadcrumbs: [mockBreadcrumb]
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
      expect(result).toEqual([mockProfileMenuItem]);
    });

    it("getBreadcrumbs() should return the current 'breadcrumbs' setting", () => {
      const result = UiQuery.getBreadcrumbs(storeState);
      expect(result).toEqual([mockBreadcrumb]);
    });
  });
});
