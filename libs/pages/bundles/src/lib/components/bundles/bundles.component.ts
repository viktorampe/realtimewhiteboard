import { Component, OnInit } from '@angular/core';
import {
  BundleInterface,
  EduContentBookInterface,
  LearningAreaInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BundlesViewModel } from '../bundles.viewmodel';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  learningArea$: Observable<LearningAreaInterface> = this.bundlesViewModel
    .selectedLearningArea$;

  toolbarFixed: boolean;
  listFormat$: Observable<ListFormat> = this.bundlesViewModel.listFormat$;
  filterInput$ = new BehaviorSubject<string>('');

  bundles$: Observable<BundleInterface[]> = combineLatest(
    this.learningArea$,
    this.bundlesViewModel.bundles$
  ).pipe(
    map(
      ([learningArea, bundles]: [LearningAreaInterface, BundleInterface[]]) => {
        return bundles.filter(bundle => {
          return bundle.learningAreaId === learningArea.id;
        });
      }
    )
  );

  displayedBundles$: Observable<BundleInterface[]> = this.getDisplayedBundles(
    this.bundles$,
    this.filterInput$
  );

  displayedBooks$: Observable<
    EduContentBookInterface[]
  > = this.getDisplayedBooks(this.bundlesViewModel.books$);

  constructor(private bundlesViewModel: BundlesViewModel) {}

  ngOnInit(): void {
    this.toolbarFixed = true;
  }

  onChangeFilterInput(filterInput: string): void {
    this.filterInput$.next(filterInput);
  }

  resetFilterInput(): void {
    this.filterInput$.next('');
  }

  clickChangeListFormat(value: string): void {
    this.bundlesViewModel.changeListFormat(ListFormat[value]);
  }

  getDisplayedBooks(
    books$: Observable<EduContentBookInterface[]>
  ): Observable<EduContentBookInterface[]> {
    return books$;
  }

  getDisplayedBundles(
    bundles$: Observable<BundleInterface[]>,
    filterInput$: BehaviorSubject<string>
  ): Observable<BundleInterface[]> {
    return combineLatest(bundles$, filterInput$).pipe(
      map(([bundles, filterInput]: [BundleInterface[], string]) => {
        if (!filterInput || filterInput === '') {
          return bundles;
        }
        return bundles.filter(bundle =>
          bundle.name.toLowerCase().includes(filterInput.toLowerCase())
        );
      })
    );
  }
}
