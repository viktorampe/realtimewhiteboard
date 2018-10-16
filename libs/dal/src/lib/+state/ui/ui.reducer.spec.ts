import { ListFormat } from '@campus/ui';
import { SetListFormatUi, ToggleSideSheetUi, UiLoaded } from './ui.actions';
import { initialState, reducer, UiState } from './ui.reducer';

describe('Ui Reducer', () => {
  let state: UiState;

  beforeEach(() => {
    state = {
      listFormat: ListFormat.GRID,
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
      const action = new SetListFormatUi({ listFormat: ListFormat.LINE });
      const result: UiState = reducer(initialState, action);
      expect(result.listFormat).toEqual(ListFormat.LINE);
    });

    it('should toggle the sideSheet', () => {
      const action = new ToggleSideSheetUi();
      const result: UiState = reducer(initialState, action);
      expect(result.sideSheetOpen).toBeTruthy();
    });

    it('should toggle the sideSheet', () => {
      const action = new ToggleSideSheetUi();
      const result: UiState = reducer(
        { ...initialState, sideSheetOpen: true },
        action
      );
      expect(result.sideSheetOpen).toBeFalsy();
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
