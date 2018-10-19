import { Component, OnInit } from '@angular/core';
import {
  BundleInterface,
  ContentInterface,
  EduContentMetadataInterface,
  LearningAreaInterface
} from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BundlesViewModel } from '../bundles.viewmodel';

/**
 * component listing bundles en book-e's for learning area
 *
 * @export
 * @class BundlesComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  protected listFormatEnum = ListFormat;

  learningArea$: Observable<LearningAreaInterface> = this.bundlesViewModel
    .activeLearningArea$;

  toolbarFixed: boolean;
  listFormat$: Observable<ListFormat> = this.bundlesViewModel.listFormat$;
  filterInput$ = new BehaviorSubject<string>('');

  /**
   * map of content length per bundle id
   *
   * @memberof BundlesComponent
   */
  bundleContentsCount$ = this.bundlesViewModel.bundleContentsCount$;

  /**
   * lists all bundles available to the current learning area
   *
   * @type {Observable<
   *     BundleInterface[]
   *   >}
   * @memberof BundlesComponent
   */
  bundles$: Observable<BundleInterface[]> = this.bundlesViewModel
    .sharedLearningAreaBundles$;

  /**
   * list of filtered bundles available to the current learning area
   *
   * @type {Observable<BundleInterface[]>}
   * @memberof BundlesComponent
   */
  displayedBundles$: Observable<BundleInterface[]> = this.getDisplayedBundles(
    this.bundles$,
    this.filterInput$
  );

  /**
   * list of book-e available to the current learning area
   *
   * @type {Observable<
   *     EduContentMetadataInterface[]
   *   >}
   * @memberof BundlesComponent
   */
  books$: Observable<ContentInterface[]> = this.bundlesViewModel
    .sharedLearningAreaBooks$;

  //
  constructor(private bundlesViewModel: BundlesViewModel) {}

  ngOnInit(): void {
    this.toolbarFixed = true;
  }

  /**
   * changes the filter's input
   *
   * @param {string} filterInput
   * @memberof BundlesComponent
   */
  onChangeFilterInput(filterInput: string): void {
    this.filterInput$.next(filterInput);
  }

  /**
   * resets filter's input
   *
   * @memberof BundlesComponent
   */
  resetFilterInput(): void {
    this.filterInput$.next('');
  }

  /**
   * set the list's format
   *
   * @param {ListFormat} format
   * @memberof BundlesComponent
   */
  clickChangeListFormat(format: ListFormat): void {
    this.bundlesViewModel.changeListFormat(format);
  }

  /**
   * get list of filtered bundles
   *
   * @param {Observable<BundleInterface[]>} bundles$
   * @param {BehaviorSubject<string>} filterInput$
   * @returns {Observable<BundleInterface[]>}
   * @memberof BundlesComponent
   */
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
