import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  BundlesViewModel,
  EduContentService,
  LearningAreaService
} from './bundles.viewmodel';

let bundlesViewModel: BundlesViewModel;

beforeEach(() => {
  bundlesViewModel = new BundlesViewModel(
    <ActivatedRoute>{},
    <Store<any>>{},
    <LearningAreaService>{
      getAll: () => new Subject(),
      getByIds: () => new Subject()
    },
    <EduContentService>{
      getAll: () => new Subject(),
      getByIds: () => new Subject()
    }
  );
});

test('it should return', () => {
  return;
});
