import { Component } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BundlesViewModel } from '../bundles.viewmodel';
import { BundlesWithContentInfo } from '../bundles.viewmodel.interfaces';

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
export class BundlesComponent {
  protected listFormat = ListFormat;

  listFormat$: Observable<ListFormat>;
  filterInput$ = new BehaviorSubject<string>('');

  learningArea$: Observable<LearningAreaInterface>;
  sharedInfo$: Observable<BundlesWithContentInfo>;
  filteredSharedInfo$: Observable<BundlesWithContentInfo>;

  constructor(private bundlesViewModel: BundlesViewModel) {
    console.log('bundlescomponent');
  }

  ngOnInit(): void {
    this.learningArea$ = this.bundlesViewModel.activeLearningArea$;
    this.listFormat$ = this.bundlesViewModel.listFormat$;
    this.sharedInfo$ = this.bundlesViewModel.activeLearningAreaBundles$;
    this.filteredSharedInfo$ = this.filterBundles(
      this.sharedInfo$,
      this.filterInput$
    );
  }

  clickChangeListFormat(value: ListFormat): void {
    this.bundlesViewModel.changeListFormat(this.listFormat[value]);
  }

  onChangeFilterInput(filterInput: string): void {
    this.filterInput$.next(filterInput);
  }

  resetFilterInput(): void {
    this.filterInput$.next('');
  }

  filterBundles(
    bundles$: Observable<BundlesWithContentInfo>,
    filterInput$: Observable<string>
  ): Observable<BundlesWithContentInfo> {
    return combineLatest(bundles$, filterInput$).pipe(
      map(([info, filterInput]: [BundlesWithContentInfo, string]) => ({
        ...info,
        bundles: this.bundlesViewModel.filterArray(
          info.bundles,
          'bundle.name',
          filterInput
        )
      }))
    );
  }
}
