import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  ClassGroupInterface,
  EduContentBookInterface,
  LearningPlanGoalInterface,
  UserLessonInterface
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
  protected book: EduContentBookInterface;
  protected methodLessonsForBook$: Observable<
    { eduContentTocId: number; values: string[] }[]
  >;
  public learningPlanGoal: LearningPlanGoalInterface;
  public classGroup: ClassGroupInterface;

  // TODO remove -> will depend on userLesson input
  public isUserLessonInput = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: LearningPlanGoalProgressManagementInterface,
    private learningPlanGoalProgressManagerVM: LearningPlanGoalProgressManagementViewModel,
    private dialogRef: MatDialogRef<LearningPlanGoalProgressManagementComponent>
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

  public saveForUserLesson(userLesson: UserLessonInterface): void {
    this.learningPlanGoalProgressManagerVM.createLearningPlanGoalProgressForUserLesson(
      this.learningPlanGoal,
      this.classGroup,
      userLesson
    );
    this.closeDialog();
  }

  public saveForEduContentTOCselection(eduContentTOCids: number[]): void {
    this.learningPlanGoalProgressManagerVM.createLearningPlanGoalProgressForEduContentTOCs(
      this.learningPlanGoal,
      this.classGroup,
      eduContentTOCids
    );
    this.closeDialog();
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
