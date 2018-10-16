import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BundlesViewModel } from './bundles.viewmodel';

let bundlesViewModel: BundlesViewModel;

beforeEach(() => {
  bundlesViewModel = new BundlesViewModel(<ActivatedRoute>{}, <Store<any>>{});
});

test('it should return', () => {
  return;
});
