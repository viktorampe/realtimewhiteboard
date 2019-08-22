import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ClassGroupInterface, LearningPlanGoalInterface } from '@campus/dal';
import { LearningPlanGoalProgressManagementInterface } from './learning-plan-goal-progress-management-dialog.interface';

@Component({
  selector: 'campus-learning-plan-goal-progress-management',
  templateUrl: './learning-plan-goal-progress-management.component.html',
  styleUrls: ['./learning-plan-goal-progress-management.component.scss']
})
export class LearningPlanGoalProgressManagementComponent implements OnInit {
  protected learningPlanGoal: LearningPlanGoalInterface;
  protected classGroup: ClassGroupInterface;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: LearningPlanGoalProgressManagementInterface
  ) {}

  ngOnInit() {
    this.learningPlanGoal = this.data.learningPlanGoal;
    this.classGroup = this.data.classGroup;
  }
}
