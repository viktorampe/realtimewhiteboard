import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatDialogRef,
  MatInput,
  MatSelectionList,
  MAT_DIALOG_DATA
} from '@angular/material';
import {
  ClassGroupInterface,
  EduContentBookInterface,
  LearningPlanGoalInterface,
  UserLessonInterface
} from '@campus/dal';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
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
  protected learningPlanGoal: LearningPlanGoalInterface;
  protected classGroup: ClassGroupInterface;
  protected book: EduContentBookInterface;
  protected methodLessonsForBook$: Observable<
    { eduContentTocId: number; values: string[] }[]
  >;

  @ViewChild(MatInput)
  private matInput: MatInput;

  @ViewChild('selectionList', { read: MatSelectionList })
  private matSelectionList: MatSelectionList;

  constructor(
    public dialogRef: MatDialogRef<LearningPlanGoalProgressManagementComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: LearningPlanGoalProgressManagementInterface,
    private learningPlanGoalProgressManagerVM: LearningPlanGoalProgressManagementViewModel
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
      this.inputFromControl.valueChanges.pipe(
        startWith(''),
        filter(val => !(val === null))
      ),
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

  selectionListDisabled(): boolean {
    // disable or enable selectionList
    return !!this.matInput.value;
  }

  inputDisabled(): boolean {
    return this.matSelectionList.selectedOptions.selected.length > 0;
  }

  selectionChanged() {
    this.setInputDisabled();
  }

  private setInputDisabled() {
    if (this.inputDisabled()) this.inputFromControl.disable();
    else this.inputFromControl.enable();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    //TODO -- this is a temp placeholder, this will be done in another issue
    if (!this.inputDisabled() && !this.selectionListDisabled())
      console.log('nothing to save here');
    else if (this.inputDisabled()) console.log('selection made');
    else if (this.selectionListDisabled()) console.log('userlesson used');
  }
}
