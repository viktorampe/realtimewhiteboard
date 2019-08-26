import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ClassGroupInterface, LearningPlanGoalInterface } from '@campus/dal';
import { LearningPlanGoalProgressManagementInterface } from './learning-plan-goal-progress-management-dialog.interface';
import { LearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel';

@Component({
  selector: 'campus-learning-plan-goal-progress-management',
  templateUrl: './learning-plan-goal-progress-management.component.html',
  styleUrls: ['./learning-plan-goal-progress-management.component.scss'],
  providers: [LearningPlanGoalProgressManagementViewModel]
})
export class LearningPlanGoalProgressManagementComponent implements OnInit {
  protected learningPlanGoal: LearningPlanGoalInterface;
  protected classGroup: ClassGroupInterface;

  // TODO remove -> will depend on userLesson input
  public isUserLessonInput = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: LearningPlanGoalProgressManagementInterface,
    private learningPlanGoalProgressManagerVM: LearningPlanGoalProgressManagementViewModel
  ) {}

  ngOnInit() {
    this.learningPlanGoal = this.data.learningPlanGoal;
    this.classGroup = this.data.classGroup;
  }
}
