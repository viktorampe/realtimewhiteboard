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
  protected userLessons$: Observable<UserLessonInterface[]>;
  protected book: EduContentBookInterface;

  @ViewChild(MatInput)
  private matInput: MatInput;

  @ViewChild('selectionList', { read: MatSelectionList })
  private matSelectionList: MatSelectionList;

  public learningPlanGoal: LearningPlanGoalInterface;
  public classGroup: ClassGroupInterface;

  public inputFromControl: FormControl;
  public filteredUserLessons$: Observable<UserLessonInterface[]>;
  public methodLessonsForBook$: Observable<
    { eduContentTocId: number; values: string[] }[]
  >;

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

  isSelectionListDisabled(): boolean {
    // disable or enable selectionList
    return !!this.matInput.value;
  }

  isInputDisabled(): boolean {
    return this.matSelectionList.selectedOptions.selected.length > 0;
  }

  selectionChanged() {
    this.toggleInputDisabled();
  }

  private toggleInputDisabled() {
    if (this.isInputDisabled()) this.inputFromControl.disable();
    else this.inputFromControl.enable();
  }

  public saveForUserLesson(): void {
    let description = null;
    const inputValue = this.inputFromControl.value;
    console.log(inputValue);
    if (typeof inputValue === 'object') {
      // user has chosen an existing user lesson
      description = inputValue.description;
    } else {
      // new user lesson
      description = inputValue;
    }

    if (description) {
      this.learningPlanGoalProgressManagerVM.createLearningPlanGoalProgressForUserLesson(
        this.learningPlanGoal.id,
        this.classGroup.id,
        description,
        this.book.id
      );
      this.closeDialog();
    }
  }

  public saveForEduContentTOCselection(): void {
    const eduContentTOCids = this.matSelectionList.selectedOptions.selected.map(
      option => option.value.eduContentTocId
    );

    if (eduContentTOCids.length) {
      this.learningPlanGoalProgressManagerVM.createLearningPlanGoalProgressForEduContentTOCs(
        this.learningPlanGoal.id,
        this.classGroup.id,
        eduContentTOCids,
        this.book.id
      );
      this.closeDialog();
    }
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
