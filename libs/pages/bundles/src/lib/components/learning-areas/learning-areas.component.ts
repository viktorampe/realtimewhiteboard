import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FilterableItem,
  FilterTextInputComponent,
  ListFormat
} from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Observable } from 'rxjs';
import { BundlesViewModel } from '../bundles.viewmodel';
import {
  LearningAreaInfoInterface,
  LearningAreasWithBundlesInfoInterface
} from '../bundles.viewmodel.interfaces';

@Component({
  selector: 'campus-learning-areas',
  templateUrl: './learning-areas.component.html',
  styleUrls: ['./learning-areas.component.scss']
})
export class LearningAreasComponent
  implements
    OnInit,
    FilterableItem<
      LearningAreasWithBundlesInfoInterface,
      LearningAreaInfoInterface
    > {
  listFormat = ListFormat;

  listFormat$: Observable<ListFormat>;
  sharedInfo$: Observable<LearningAreasWithBundlesInfoInterface>;

  @ViewChild(FilterTextInputComponent, { static: true })
  filterTextInput: FilterTextInputComponent<
    LearningAreasWithBundlesInfoInterface,
    LearningAreaInfoInterface
  >;

  constructor(
    private bundlesViewModel: BundlesViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit(): void {
    this.listFormat$ = this.bundlesViewModel.listFormat$;
    this.sharedInfo$ = this.bundlesViewModel.sharedLearningAreas$;
    this.filterTextInput.setFilterableItem(this);
  }

  clickChangeListFormat(value: ListFormat): void {
    this.bundlesViewModel.changeListFormat(value);
  }

  filterFn(
    info: LearningAreasWithBundlesInfoInterface,
    searchText: string
  ): LearningAreaInfoInterface[] {
    return this.filterService.filter(info.learningAreas, {
      learningArea: { name: searchText }
    });
  }
}
