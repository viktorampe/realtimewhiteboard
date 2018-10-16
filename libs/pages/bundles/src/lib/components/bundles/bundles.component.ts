import { Component, OnInit } from '@angular/core';
import {
  BundleInterface,
  EduContentMetadataInterface,
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
  protected listFormatEnum = ListFormat;
  private currentLearningArea = 0; // todo replace with actual learning area when viewmodel is updated

  learningArea$: Observable<
    LearningAreaInterface
  > = this.bundlesViewModel.learningAreas$.pipe(
    map(areas => {
      return {
        icon: 'polpo-wiskunde',
        id: 19,
        color: '#2c354f',
        name: 'Wiskunde'
      };
    })
  );

  toolbarFixed: boolean;
  listFormat$: Observable<ListFormat> = this.bundlesViewModel.listFormat$;
  filterInput$ = new BehaviorSubject<string>('');
  bundleContentsCount$ = this.bundlesViewModel.bundleContentsCount$;

  allBundles$: Observable<
    BundleInterface[]
  > = this.bundlesViewModel.sharedLearningAreaBundles$.pipe(
    map(
      bundles =>
        bundles[this.currentLearningArea]
          ? bundles[this.currentLearningArea]
          : []
    )
  );

  displayedBundles$: Observable<BundleInterface[]> = this.getDisplayedBundles(
    this.allBundles$,
    this.filterInput$
  );

  books$: Observable<
    EduContentMetadataInterface[]
  > = this.bundlesViewModel.sharedLearningAreaBooks$.pipe(
    map(
      books =>
        books[this.currentLearningArea] ? books[this.currentLearningArea] : []
    )
  );

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
