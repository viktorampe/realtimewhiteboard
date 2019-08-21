import { Component, Input, OnInit } from '@angular/core';
import { ClassGroupInterface, LearningPlanGoalInterface } from '@campus/dal';

@Component({
  selector: 'campus-learning-plan-goal-progress-management',
  templateUrl: './learning-plan-goal-progress-management.component.html',
  styleUrls: ['./learning-plan-goal-progress-management.component.scss']
})
export class LearningPlanGoalProgressManagementComponent implements OnInit {
  @Input() classGroup: ClassGroupInterface;
  @Input() learningPlanGoal: LearningPlanGoalInterface;
  constructor() {}

  ngOnInit() {}
}
