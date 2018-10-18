import { inject, TestBed } from '@angular/core/testing';
import { DalState, UiActions } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Store } from '@ngrx/store';
import { BundlesViewModel } from './bundles.viewmodel';

describe('bundlesViewModel', () => {
  let bundlesViewModel: BundlesViewModel;
  let store: Store<DalState>;
  let dispatchSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BundlesViewModel,
        {
          provide: Store,
          useValue: {
            dispatch: () => {}
          }
        }
      ]
    });
    bundlesViewModel = TestBed.get(BundlesViewModel);
    store = TestBed.get(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  it('should be created and available via DI', inject(
    [BundlesViewModel],
    (viewModel: BundlesViewModel) => {
      expect(viewModel).toBeTruthy();
    }
  ));

  describe('list format', () => {
    it('should set the list format to grid', () => {
      bundlesViewModel.changeListFormat(ListFormat.GRID);
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new UiActions.SetListFormatUi({ listFormat: ListFormat.GRID })
      );
    });

    it('should set the list format to line', () => {
      bundlesViewModel.changeListFormat(ListFormat.LINE);
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new UiActions.SetListFormatUi({ listFormat: ListFormat.LINE })
      );
    });
  });
});
