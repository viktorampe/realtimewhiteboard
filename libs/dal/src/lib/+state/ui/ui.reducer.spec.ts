import {
  BreadcrumbLinkInterface,
  DropdownMenuItemInterface,
  ListFormat,
  NavItem
} from '../../+external-interfaces';
import {
  SetBreadcrumbs,
  SetListFormat,
  SetProfileMenuItems,
  SetSideNavItems,
  ToggleSideNav,
  ToggleSideSheet,
  UiLoaded,
  UpdateNavItem
} from './ui.actions';
import { initialState, reducer, UiState } from './ui.reducer';

describe('Ui Reducer', () => {
  let state: UiState;

  let mockNavItem: NavItem;
  let mockProfileMenuItem: DropdownMenuItemInterface;
  let mockBreadcrumb: BreadcrumbLinkInterface;

  beforeAll(() => {
    mockNavItem = { title: 'mockNavItem' };
    mockProfileMenuItem = { description: 'mock' };
    mockBreadcrumb = { displayText: 'foo', link: ['url'] };
  });

  beforeEach(() => {
    state = {
      listFormat: ListFormat.GRID,
      sideSheetOpen: true,
      sideNavOpen: true,
      sideNavItems: [],
      profileMenuItems: [],
      breadcrumbs: [],
      loaded: true
    };
  });

  describe('valid Ui actions ', () => {
    it('should return ui object', () => {
      const action = new UiLoaded({ state });
      const result: UiState = reducer(initialState, action);
      expect(result).toEqual(state);
    });

    it('should change the listFormat', () => {
      const action = new SetListFormat({ listFormat: ListFormat.LINE });
      const result: UiState = reducer(initialState, action);
      expect(result.listFormat).toEqual(ListFormat.LINE);
    });

    it('should open the sideSheet', () => {
      const action = new ToggleSideSheet();
      const result: UiState = reducer(
        { ...initialState, sideSheetOpen: false },
        action
      );
      expect(result.sideSheetOpen).toBeTruthy();
    });

    it('should close the sideSheet', () => {
      const action = new ToggleSideSheet();
      const result: UiState = reducer(
        { ...initialState, sideSheetOpen: true },
        action
      );
      expect(result.sideSheetOpen).toBeFalsy();
    });

    it('should toggle the side nav', () => {
      const action = new ToggleSideNav();
      const result: UiState = reducer(initialState, action);
      expect(result.sideNavOpen).toBe(!initialState.sideNavOpen);
    });

    it('should toggle the side nav open', () => {
      const action = new ToggleSideNav({ open: true });
      const result: UiState = reducer(initialState, action);
      expect(result.sideNavOpen).toBe(true);
    });

    it('should toggle the side nav closed', () => {
      const action = new ToggleSideNav({ open: false });
      const result: UiState = reducer(initialState, action);
      expect(result.sideNavOpen).toBe(false);
    });

    it('should set the sideNavItems', () => {
      const action = new SetSideNavItems({ navItems: [mockNavItem] });
      const result: UiState = reducer(initialState, action);
      expect(result.sideNavItems).toEqual([mockNavItem]);
    });

    it('should set the profileMenuItems', () => {
      const action = new SetProfileMenuItems({
        menuItems: [mockProfileMenuItem]
      });
      const result: UiState = reducer(initialState, action);
      expect(result.profileMenuItems).toEqual([mockProfileMenuItem]);
    });

    it('should set the breadcrumbs', () => {
      const action = new SetBreadcrumbs({
        breadcrumbs: [mockBreadcrumb]
      });
      const result: UiState = reducer(initialState, action);
      expect(result.breadcrumbs).toEqual([mockBreadcrumb]);
    });

    it('should update a navItem', () => {
      const mockNavItemArray = [
        { ...mockNavItem, title: 'title1' },
        { ...mockNavItem, title: 'title2' },
        { ...mockNavItem, title: 'title3' }
      ];

      const loadAction = new SetSideNavItems({ navItems: mockNavItemArray });
      const filledState: UiState = reducer(initialState, loadAction);

      const updatedNavItem = {
        ...mockNavItem,
        title: 'title2',
        expanded: true
      };

      const action = new UpdateNavItem({ navItem: updatedNavItem });

      const expectedArray = [...mockNavItemArray];
      expectedArray[1] = updatedNavItem;

      const result: UiState = reducer(filledState, action);
      expect(result.sideNavItems).toEqual(expectedArray);
    });
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
