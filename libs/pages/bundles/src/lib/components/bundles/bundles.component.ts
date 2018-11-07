import { Component, ViewChild } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { Observable } from 'rxjs';
import { FilterService } from '../bundles.filter';
import { BundlesViewModel } from '../bundles.viewmodel';
import {
  BundleInfoInterface,
  BundlesWithContentInfoInterface
} from '../bundles.viewmodel.interfaces';

type NestedPartial<T> = { [P in keyof T]?: NestedPartial<T[P]> };

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

  learningArea$: Observable<LearningAreaInterface>;
  sharedInfo$: Observable<BundlesWithContentInfoInterface>;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    BundlesWithContentInfoInterface,
    BundleInfoInterface
  >;

  constructor(
    private bundlesViewModel: BundlesViewModel,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterTextInput.filterFn = this.filterFn.bind(this);
    this.learningArea$ = this.bundlesViewModel.activeLearningArea$;
    this.listFormat$ = this.bundlesViewModel.listFormat$;
    this.sharedInfo$ = this.bundlesViewModel.activeLearningAreaBundles$;
  }

  clickChangeListFormat(value: ListFormat): void {
    this.bundlesViewModel.changeListFormat(this.listFormat[value]);
  }

  private filterFn(
    info: BundlesWithContentInfoInterface,
    searchText: string
  ): BundleInfoInterface[] {
    return this.filterService.filter(info.bundles, {
      bundle: { name: searchText }
    });
  }
}
