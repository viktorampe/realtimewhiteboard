import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { LearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockLearningPlanGoalProgressManagementViewModel
  implements ViewModelInterface<LearningPlanGoalProgressManagementViewModel> {}
