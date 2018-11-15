import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
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
export class LearningAreasComponent implements OnInit {
  protected listFormat = ListFormat;

  listFormat$: Observable<ListFormat>;
  sharedInfo$: Observable<LearningAreasWithBundlesInfoInterface>;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    LearningAreasWithBundlesInfoInterface,
    LearningAreaInfoInterface
  >;

  constructor(
    private bundlesViewModel: BundlesViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit(): void {
    this.filterTextInput.filterFn = (info, searchText) =>
      this.filterFn(info, searchText.toString());
    this.listFormat$ = this.bundlesViewModel.listFormat$;
    this.sharedInfo$ = this.bundlesViewModel.sharedLearningAreas$;
  }

  clickChangeListFormat(value: ListFormat): void {
    this.bundlesViewModel.changeListFormat(value);
  }

  private filterFn(
    info: LearningAreasWithBundlesInfoInterface,
    searchText: string
  ): LearningAreaInfoInterface[] {
    return this.filterService.filter(info.learningAreas, {
      learningArea: { name: searchText }
    });
  }
}
