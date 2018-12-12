import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FilterableItem, FilterTextInputComponent } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Observable } from 'rxjs';
import {
  LearningAreaInterface,
  LearningAreasWithResultsInterface
} from './reports.viewmodel.interfaces';
import { MockReportsViewModel } from './reports.viewmodel.mock';

@Component({
  selector: 'campus-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent
  implements
    OnInit,
    FilterableItem<LearningAreaInterface[], LearningAreaInterface> {
  learningAreasWithResults$: Observable<
    LearningAreasWithResultsInterface
  > = this.viewModel.learningAreasWithResults$;
  listFormat$ = this.viewModel.listFormat$;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    LearningAreaInterface[],
    LearningAreaInterface
  >;

  constructor(
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface,
    private viewModel: MockReportsViewModel
  ) {}

  ngOnInit() {
    this.filterTextInput.setFilterableItem(this);
  }

  filterFn(
    source: LearningAreaInterface[],
    filterText: string
  ): LearningAreaInterface[] {
    return this.filterService.filter(source, {
      learningArea: {
        name: filterText
      }
    });
  }
}
