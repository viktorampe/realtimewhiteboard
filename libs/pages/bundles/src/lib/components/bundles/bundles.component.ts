import { Component, ViewChild } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { BundlesViewModel } from '../bundles.viewmodel';
import { BundlesWithContentInfoInterface } from '../bundles.viewmodel.interfaces';

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
  sharedInfo$: Observable<BundlesWithContentInfoInterface>;
  filteredBundles$ = new BehaviorSubject<any[]>([]);

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent;

  constructor(private bundlesViewModel: BundlesViewModel) {}

  ngOnInit(): void {
    this.learningArea$ = this.bundlesViewModel.activeLearningArea$;
    this.listFormat$ = this.bundlesViewModel.listFormat$;
    this.sharedInfo$ = this.bundlesViewModel.activeLearningAreaBundles$;
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
}
