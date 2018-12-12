import { Injectable } from '@angular/core';
import { MockReportsViewModel } from './reports.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class ReportsViewModel {
  constructor(private mockViewModel: MockReportsViewModel) {}

  getLearningAreaById(areaId: number) {
    return this.mockViewModel.getLearningAreaById();
  }

  getAssignmentResultsByLearningArea(areaId: number) {
    return this.mockViewModel.getAssignmentResultsByLearningArea();
  }
}
