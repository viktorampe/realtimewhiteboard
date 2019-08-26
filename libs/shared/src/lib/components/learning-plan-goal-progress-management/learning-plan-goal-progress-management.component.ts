import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import {
  ClassGroupInterface,
  EduContentBookInterface,
  LearningPlanGoalInterface
} from '@campus/dal';
import { Observable } from 'rxjs';
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
  protected book: EduContentBookInterface;
  protected methodLessonsForBook$: Observable<
    { eduContentTocId: number; values: string[] }[]
  >;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: LearningPlanGoalProgressManagementInterface,
    private learningPlanGoalProgressManagerVM: LearningPlanGoalProgressManagementViewModel
  ) {}

  ngOnInit() {
    this.learningPlanGoal = this.data.learningPlanGoal;
    this.classGroup = this.data.classGroup;
    this.book = this.data.book;
    this.methodLessonsForBook$ = this.learningPlanGoalProgressManagerVM.getMethodLessonsForBook(
      this.book.id,
      this.learningPlanGoal.id
    );
  }
}
