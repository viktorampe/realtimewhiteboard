import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AssigneeInterface, AssigneeTypesEnum } from '@campus/dal';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManageKabasTasksAssigneeDataInterface } from './manage-kabas-tasks-assignee-data.interface';

@Component({
  selector: 'campus-manage-kabas-tasks-assignee-modal',
  templateUrl: './manage-kabas-tasks-assignee-modal.component.html',
  styleUrls: ['./manage-kabas-tasks-assignee-modal.component.scss']
})
export class ManageKabasTasksAssigneeModalComponent implements OnInit {
  public showAddAssignees = false;
  public currentTaskName: string;
  public currentTaskIsPaperTask: boolean;
  public currentTaskAssignees$: BehaviorSubject<AssigneeInterface[]>;
  public areCurrentTaskAssigneesValid$: Observable<boolean>;
  public availableTaskClassGroups$: Observable<AssigneeInterface[]>;
  public availableTaskGroups$: Observable<AssigneeInterface[]>;
  public availableTaskStudents$: Observable<AssigneeInterface[]>;
  public default: { start: Date; end: Date };
  public showAdvanced = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: ManageKabasTasksAssigneeDataInterface,
    private dialogRef: MatDialogRef<ManageKabasTasksAssigneeModalComponent>
  ) {}

  ngOnInit() {
    this.determineDefaultDateInterval(this.data.currentTaskAssignees);

    this.currentTaskName = this.data.title;
    this.currentTaskIsPaperTask = this.data.isPaperTask;

    // page assignees shouldn't be affected -> clone
    this.currentTaskAssignees$ = new BehaviorSubject(
      this.data.currentTaskAssignees.map(cTA => ({
        ...cTA
      }))
    );

    this.showAdvanced =
      !this.currentTaskIsPaperTask &&
      !this.currentTaskAssignees$.value.every(cTA =>
        this.isDefaultDate(cTA.start, cTA.end)
      );

    this.areCurrentTaskAssigneesValid$ = this.getAreCurrentTaskAssigneesValid$();

    this.availableTaskClassGroups$ = this.getAvailableTaskClassGroups$();
    this.availableTaskGroups$ = this.getAvailableTaskGroups$();
    this.availableTaskStudents$ = this.getAvailableTaskStudents$();
  }

  public setShowAdvanced(value) {
    // switching back to basic view
    if (!value) {
      // set all date boundaries to default
      const currentTaskAssignees = this.currentTaskAssignees$.value;
      this.setAssignmentDate(currentTaskAssignees, this.default);
    }

    this.showAdvanced = value;
  }

  public setDefaultDateRange(event: { start: Date; end: Date }) {
    this.default = event;
    const taskAssignees = this.currentTaskAssignees$.value;

    this.setAssignmentDate(taskAssignees, this.default);
  }

  public toggleAddAssignees() {
    this.showAddAssignees = !this.showAddAssignees;
  }

  public addAssignees(assignees: AssigneeInterface[]) {
    let dateBoundaries;

    if (!this.showAdvanced && !this.currentTaskIsPaperTask) {
      dateBoundaries = this.default;
    }

    const assigneesToAdd = assignees.map(tA => ({
      ...tA,
      ...dateBoundaries
    }));
    this.currentTaskAssignees$.next([
      ...this.currentTaskAssignees$.value,
      ...assigneesToAdd
    ]);

    this.toggleAddAssignees();
  }

  public removeAssignee(assignee: AssigneeInterface) {
    const newCurrentTaskAssignees = this.currentTaskAssignees$.value.filter(
      cTA => cTA !== assignee
    );

    this.currentTaskAssignees$.next([...newCurrentTaskAssignees]);

    if (!newCurrentTaskAssignees.length) {
      this.setShowAdvanced(false);
    }
  }

  public setAssignmentDate(
    assignees: AssigneeInterface[],
    dateInterval: { start: Date; end: Date }
  ) {
    // update assignee start/end by reference
    assignees.forEach(assignee => {
      Object.assign(assignee, {
        start: dateInterval.start,
        end: dateInterval.end
      });
    });

    this.currentTaskAssignees$.next([...this.currentTaskAssignees$.value]);
  }

  public onOKButtonClick() {
    this.dialogRef.close(this.currentTaskAssignees$.value);
  }

  public onCancelButtonClick() {
    this.dialogRef.close();
  }

  private isDefaultDate(start: Date, end: Date): boolean {
    return (
      start.getTime() === this.default.start.getTime() &&
      end.getTime() === this.default.end.getTime()
    );
  }

  private determineDefaultDateInterval(currentTaskAssignees) {
    let start, end;

    // is paper task -> no boundaries
    if (this.currentTaskIsPaperTask) {
      start = undefined;
      end = undefined;
    } else {
      // no assignees -> rest of schoolyear
      if (currentTaskAssignees.length === 0) {
        const today = new Date();
        const schoolYear = this.getSchoolYearBoundaries(today);

        start = today;
        end = schoolYear.end;
      } else {
        const aggregatedBoundaries = this.aggregateAssigneeBoundaries(
          currentTaskAssignees
        );

        // all assignees use same interval -> use he most frequent (i.e. only) value
        // if differing boundaries -> use the most frequent
        start = aggregatedBoundaries.mostFrequentStartDate;
        end = aggregatedBoundaries.mostFrequentEndDate;
      }
    }

    this.default = { start, end };
  }

  // return start- and endDate of schoolyear
  private getSchoolYearBoundaries(date: Date): { start: Date; end: Date } {
    // months are 0-based
    const startYear =
      date.getMonth() >= 8 ? date.getFullYear() : date.getFullYear() - 1;

    return {
      start: new Date(startYear, 8, 1),
      end: new Date(startYear + 1, 5, 30)
    };
  }

  // reduce taskAssignees to object containing
  // most frequently used start- and endDates
  private aggregateAssigneeBoundaries(currentTaskAssignees) {
    const boundaryFrequencies = currentTaskAssignees.reduce(
      (acc, cTA) => {
        if (!acc.start.has(cTA.start)) {
          acc.start.set(cTA.start, 1);
        } else {
          acc.start.set(cTA.start, acc.start.get(cTA.start) + 1);
        }

        if (!acc.end.has(cTA.end)) {
          acc.end.set(cTA.end, 1);
        } else {
          acc.end.set(cTA.end, acc.end.get(cTA.end) + 1);
        }

        return acc;
      },
      { start: new Map<Date, number>(), end: new Map<Date, number>() }
    );

    const mostFrequentStartDate = this.getMostFrequent(
      boundaryFrequencies.start
    );
    const mostFrequentEndDate = this.getMostFrequent(boundaryFrequencies.end);

    return {
      mostFrequentStartDate,
      mostFrequentEndDate
    };
  }

  private getMostFrequent(dateMap: Map<Date, number>): Date {
    let maxValue = 0;
    let maxKey;

    dateMap.forEach((value, key) => {
      if (value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    });

    return maxKey;
  }

  private getAvailableTaskClassGroups$() {
    return this.currentTaskAssignees$.pipe(
      map(currentTaskAssignees => {
        return this.data.possibleTaskClassGroups.filter(
          pTA =>
            !currentTaskAssignees.some(
              cTA =>
                cTA.relationId === pTA.relationId &&
                cTA.type === AssigneeTypesEnum.CLASSGROUP
            )
        );
      })
    );
  }
  private getAvailableTaskGroups$() {
    return this.currentTaskAssignees$.pipe(
      map(currentTaskAssignees =>
        this.data.possibleTaskGroups.filter(
          pTA =>
            !currentTaskAssignees.some(
              cTA =>
                cTA.relationId === pTA.relationId &&
                cTA.type === AssigneeTypesEnum.GROUP
            )
        )
      )
    );
  }
  private getAvailableTaskStudents$() {
    return this.currentTaskAssignees$.pipe(
      map(currentTaskAssignees =>
        this.data.possibleTaskStudents.filter(
          pTA =>
            !currentTaskAssignees.some(
              cTA =>
                cTA.relationId === pTA.relationId &&
                cTA.type === AssigneeTypesEnum.STUDENT
            )
        )
      )
    );
  }

  private getAreCurrentTaskAssigneesValid$() {
    return this.currentTaskAssignees$.pipe(
      map(
        cTAs =>
          this.currentTaskIsPaperTask ||
          cTAs.every(cTA => cTA.start && cTA.end && cTA.start <= cTA.end)
      )
    );
  }
}
