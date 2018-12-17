import { Injectable } from '@angular/core';
import { ListFormat } from '@campus/ui';
import { Observable } from 'rxjs';
import { LearningAreasWithResultsInterface } from './reports.viewmodel.interfaces';
import { MockReportsViewModel } from './reports.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class ReportsViewModel {
  learningAreasWithResults$: Observable<LearningAreasWithResultsInterface>;
  listFormat$: Observable<ListFormat>;

  constructor(private mockViewModel: MockReportsViewModel) {
    this.learningAreasWithResults$ = this.mockViewModel.learningAreasWithResults$;
    this.listFormat$ = this.mockViewModel.listFormat$;
  }

  getLearningAreaById(areaId: number) {
    return this.mockViewModel.getLearningAreaById();
  }

  getAssignmentResultsByLearningArea(areaId: number) {
    return this.mockViewModel.getAssignmentResultsByLearningArea();
  }

  changeListFormat(listFormat: ListFormat): void {
    this.mockViewModel.changeListFormat(listFormat);
  }
}
