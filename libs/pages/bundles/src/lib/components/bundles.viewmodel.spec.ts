import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  BundleService,
  BundlesViewModel,
  EduContentService,
  LearningAreaService,
  UnlockedContentService
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
    <BundleService>{
      getAll: () => new Subject(),
      getById: () => new Subject()
    },
    <UnlockedContentService>{ getAll: () => new Subject() },
    <EduContentService>{
      getAll: () => new Subject(),
      getByIds: () => new Subject()
    }
  );
});

test('it should return', () => {
  return;
});
