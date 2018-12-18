import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FilterableItem,
  FilterTextInputComponent,
  ListFormat
} from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Observable } from 'rxjs';
import { ReportsViewModel } from '../reports.viewmodel';
import {
  LearningAreasWithResultsInterface,
  LearningAreaWithResultsInterface
} from '../reports.viewmodel.interfaces';

@Component({
  selector: 'campus-reports',
  templateUrl: './overview-area-with-results.component.html',
  styleUrls: ['./overview-area-with-results.component.scss']
})
export class OverviewAreaWithResultsComponent
  implements
    OnInit,
    FilterableItem<
      LearningAreasWithResultsInterface,
      LearningAreaWithResultsInterface
    > {
  learningAreasWithResults$: Observable<
    LearningAreasWithResultsInterface
  > = this.viewModel.learningAreasWithResults$;
  listFormat$ = this.viewModel.listFormat$;
  protected listFormat = ListFormat;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    LearningAreasWithResultsInterface,
    LearningAreaWithResultsInterface
  >;

  constructor(
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface,
    private viewModel: ReportsViewModel
  ) {}

  ngOnInit() {
    this.filterTextInput.setFilterableItem(this);
  }

  clickChangeListFormat(format: ListFormat) {
    this.viewModel.changeListFormat(format);
  }

  filterFn(
    source: LearningAreasWithResultsInterface,
    filterText: string
  ): LearningAreaWithResultsInterface[] {
    if (source) {
      return this.filterService.filter(source.learningAreas, {
        learningArea: {
          name: filterText
        }
      });
    }
  }
}
