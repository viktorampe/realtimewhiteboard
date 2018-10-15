import { Component, OnInit } from '@angular/core';
import {
  BundleInterface,
  EduContentBookInterface,
  LearningAreaInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { BundlesViewModel } from '../bundles.viewmodel';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  protected listFormatEnum = ListFormat;

  learningArea$: Observable<LearningAreaInterface> = this.bundlesViewModel
    .selectedLearningArea$;

  toolbarFixed: boolean;
  listFormat$: Observable<ListFormat> = this.bundlesViewModel.listFormat$;
  filterInput$ = new BehaviorSubject<string>('');

  displayedBundles$: Observable<
    BundleInterface[]
  > = this.bundlesViewModel.getDisplayedBundles(
    this.bundlesViewModel.bundles$,
    this.filterInput$
  );

  books$: Observable<EduContentBookInterface[]> = this.bundlesViewModel.books$;

  //
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

  clickChangeListFormat(format: ListFormat): void {
    this.bundlesViewModel.changeListFormat(format);
  }
}
