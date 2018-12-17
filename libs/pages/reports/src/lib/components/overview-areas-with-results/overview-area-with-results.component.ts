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
export class OverViewAreaWithResultsComponent
  implements
    OnInit,
    FilterableItem<
      LearningAreaWithResultsInterface[],
      LearningAreaWithResultsInterface
    > {
  learningAreasWithResults$: Observable<
    LearningAreasWithResultsInterface
  > = this.viewModel.learningAreasWithResults$;
  listFormat$ = this.viewModel.listFormat$;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    LearningAreaWithResultsInterface[],
    LearningAreaWithResultsInterface
  >;

  constructor(
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface,
    private viewModel: ReportsViewModel
  ) {}

  ngOnInit() {
    this.filterTextInput.setFilterableItem(this);
  }

  setListFormat(format: ListFormat) {
    this.viewModel.changeListFormat(format);
  }

  filterFn(
    source: LearningAreaWithResultsInterface[],
    filterText: string
  ): LearningAreaWithResultsInterface[] {
    if (source) {
      return this.filterService.filter(source, {
        learningArea: {
          name: filterText
        }
      });
    }
  }
}
