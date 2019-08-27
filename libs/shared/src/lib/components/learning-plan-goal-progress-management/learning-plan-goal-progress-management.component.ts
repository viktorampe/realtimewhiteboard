import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  ClassGroupInterface,
  EduContentBookInterface,
  LearningPlanGoalInterface,
  UserLessonInterface
} from '@campus/dal';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LearningPlanGoalProgressManagementInterface } from './learning-plan-goal-progress-management-dialog.interface';
import { LearningPlanGoalProgressManagementViewModel } from './learning-plan-goal-progress-management.viewmodel';

@Component({
  selector: 'campus-learning-plan-goal-progress-management',
  templateUrl: './learning-plan-goal-progress-management.component.html',
  styleUrls: ['./learning-plan-goal-progress-management.component.scss'],
  providers: [LearningPlanGoalProgressManagementViewModel]
})
export class LearningPlanGoalProgressManagementComponent implements OnInit {
  protected inputFromControl: FormControl;
  protected userLessons$: Observable<UserLessonInterface[]>;
  protected filteredUserLessons$: Observable<UserLessonInterface[]>;
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
    this.inputFromControl = new FormControl();
    this.learningPlanGoal = this.data.learningPlanGoal;
    this.classGroup = this.data.classGroup;
    this.book = this.data.book;
    this.methodLessonsForBook$ = this.learningPlanGoalProgressManagerVM.getMethodLessonsForBook(
      this.book.id,
      this.learningPlanGoal.id
    );
    this.userLessons$ = this.learningPlanGoalProgressManagerVM.userLessons$;
    this.filteredUserLessons$ = this.getFilteredUserLessons();
  }

  displayUserLesson(userLesson: UserLessonInterface): string {
    return userLesson ? userLesson.description : undefined;
  }

  getFilteredUserLessons(): Observable<UserLessonInterface[]> {
    return combineLatest([
      this.inputFromControl.valueChanges.pipe(startWith('')),
      this.userLessons$
    ]).pipe(
      map(
        ([value, userLessons]: [
          string | UserLessonInterface,
          UserLessonInterface[]
        ]) => this.inputFilter(value, userLessons)
      )
    );
  }

  private inputFilter(
    value: string | UserLessonInterface,
    userLessons: UserLessonInterface[]
  ): UserLessonInterface[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value.description.toLowerCase();
    return userLessons.filter(userLesson =>
      userLesson.description.toLowerCase().includes(filterValue)
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
