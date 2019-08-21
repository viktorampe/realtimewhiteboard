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

  ngOnInit() {
    this.classGroup = { name: 'fooClass' };
    this.learningPlanGoal = {
      goal: 'bar goal',
      uniqueIdentifier: '12345',
      prefix: '1.1.1',
      type: 'bar'
    };
  }
}
