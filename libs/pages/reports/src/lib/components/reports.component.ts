import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterTextInputComponent } from '@campus/ui';
import { FilterServiceInterface } from '@campus/utils';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'campus-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent
  implements
    OnInit,
    FilterServiceInterface<
      LearningAreasWithResultsInterface[],
      LearningAreasWithResultsInterface
    > {
  learningArea$: Observable<LearningAreasWithResultsInterface[]> = of([]);
  listFormat$ = this.viewModel.listFormat$;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    LearningAreasWithResultsInterface[],
    LearningAreasWithResultsInterface
  >;

  constructor(private viewModel: MockReportsViewModel) {}

  ngOnInit() {}

  filter(a, b): LearningAreasWithResultsInterface[] {}
}
