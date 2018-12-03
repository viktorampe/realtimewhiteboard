import { ListFormat, NavItem } from '@campus/ui';
import {
  SetListFormat,
  SetProfileMenuItems,
  SetSideNavItems,
  ToggleSideNav,
  ToggleSideSheet,
  UiLoaded
} from './ui.actions';
import { initialState, reducer, UiState } from './ui.reducer';

describe('Ui Reducer', () => {
  let state: UiState;

  let mockNavItem: NavItem;

  beforeAll(() => {
    mockNavItem = { title: 'mockNavItem' };
  });

  beforeEach(() => {
    state = {
      listFormat: ListFormat.GRID,
      sideSheetOpen: true,
      sideNavOpen: true,
      sideNavItems: [],
      profileMenuItems: [],
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

    it('should set the sideNavItems', () => {
      const action = new SetSideNavItems({ navItems: [mockNavItem] });
      const result: UiState = reducer(initialState, action);
      expect(result.sideNavItems).toEqual([mockNavItem]);
    });

    it('should set the profileMenuItems', () => {
      const action = new SetProfileMenuItems({ navItems: [mockNavItem] });
      const result: UiState = reducer(initialState, action);
      expect(result.profileMenuItems).toEqual([mockNavItem]);
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
