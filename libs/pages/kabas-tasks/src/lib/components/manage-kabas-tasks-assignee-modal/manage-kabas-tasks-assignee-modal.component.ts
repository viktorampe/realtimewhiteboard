import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TaskStudentFixture } from '@campus/dal';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../../interfaces/Assignee.interface';

@Component({
  selector: 'campus-manage-kabas-tasks-assignee-modal',
  templateUrl: './manage-kabas-tasks-assignee-modal.component.html',
  styleUrls: ['./manage-kabas-tasks-assignee-modal.component.scss']
})
export class ManageKabasTasksAssigneeModalComponent implements OnInit {
  public showAddAssignees = false;
  public currentTaskName: string;
  public currentTaskAssignees: AssigneeInterface[];
  public defaultStartDate: Date;
  public defaultEndDate: Date;
  public showAdvancedBoundaries = false;
  public canToggleAdvanceBoundaries = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ManageKabasTasksAssigneeModalComponent>
  ) {
    // page assignees shouldn't be affected -> clone
    this.currentTaskAssignees = data.currentTaskAssignees.map(cTA => ({
      ...cTA
    }));
    this.currentTaskName = data.title;
    this.determineDefaultDateInterval();
    this.canToggleAdvanceBoundaries = this.getCanToggleAdvancedBoundaries();
  }

  ngOnInit() {}

  public toggleAdvancedBoundaries() {
    if (!this.canToggleAdvanceBoundaries) return;

    this.showAdvancedBoundaries = !this.showAdvancedBoundaries;
    this.canToggleAdvanceBoundaries = this.getCanToggleAdvancedBoundaries();
  }

  public setDefaultDateRange(event: { start: Date; end: Date }) {
    this.currentTaskAssignees
      .filter(
        cTA =>
          cTA.start.getTime() === this.defaultStartDate.getTime() &&
          cTA.end.getTime() === this.defaultEndDate.getTime()
      )
      .forEach(cTA => {
        cTA.start = event.start;
        cTA.end = event.end;
      });

    this.defaultStartDate = event.start;
    this.defaultEndDate = event.end;
  }

  public openAddAssignees() {
    this.showAddAssignees = !this.showAddAssignees;
  }

  public addAssignees(event) {
    // TODO event is click, for now
    // TODO use actual input

    const newTaskStudent = new TaskStudentFixture();

    const assigneesToAdd = [newTaskStudent].map(tA => ({
      ...tA,
      label: 'Alfred Jodocus',
      type: AssigneeTypesEnum.STUDENT,
      start: this.defaultStartDate,
      end: this.defaultEndDate
    }));
    this.currentTaskAssignees.push(...assigneesToAdd);

    if (this.currentTaskAssignees.length === 1) {
      this.showAdvancedBoundaries = false;
    }

    this.canToggleAdvanceBoundaries = this.getCanToggleAdvancedBoundaries();
  }

  public removeAssignee(assignee: AssigneeInterface) {
    this.currentTaskAssignees = this.currentTaskAssignees.filter(
      cTA => cTA !== assignee
    );
    this.canToggleAdvanceBoundaries = this.getCanToggleAdvancedBoundaries();
  }

  public setAssignmentDate(
    assignee: AssigneeInterface,
    event: { start: Date; end: Date }
  ) {
    assignee.start = event.start;
    assignee.end = event.end;

    this.canToggleAdvanceBoundaries = this.getCanToggleAdvancedBoundaries();
  }

  public setDefaultDate(assignee: AssigneeInterface) {
    assignee.start = this.defaultStartDate;
    assignee.end = this.defaultEndDate;
    this.canToggleAdvanceBoundaries = this.getCanToggleAdvancedBoundaries();
  }

  public onOKButtonClick() {
    this.dialogRef.close(this.currentTaskAssignees);
  }

  public onCancelButtonClick() {
    this.dialogRef.close();
  }

  public isDefaultDate(start: Date, end: Date): boolean {
    return (
      start.getTime() === this.defaultStartDate.getTime() &&
      end.getTime() === this.defaultEndDate.getTime()
    );
  }

  private getCanToggleAdvancedBoundaries() {
    // can always change to advanced
    if (!this.showAdvancedBoundaries) {
      return true;
    }

    const aggregatedBoundaries = this.aggregateAssigneeBoundaries();

    return (
      // 1 value
      aggregatedBoundaries.startAmount === 1 &&
      aggregatedBoundaries.endAmount === 1 &&
      // matches default
      this.isDefaultDate(
        aggregatedBoundaries.mostFrequentStartDate,
        aggregatedBoundaries.mostFrequentEndDate
      )
    );
  }

  private determineDefaultDateInterval() {
    // no assignees -> rest of schoolyear
    if (this.currentTaskAssignees.length === 0) {
      const today = new Date();
      const schoolYear = this.getSchoolYearBoundaries(today);

      this.defaultStartDate = today;
      this.defaultEndDate = schoolYear.end;
      return;
    }

    const aggregatedBoundaries = this.aggregateAssigneeBoundaries();

    // all assignees use same interval -> use he most frequent (i.e. only) value
    // if differing boundaries -> use the most frequent and show advanced
    this.defaultStartDate = aggregatedBoundaries.mostFrequentStartDate;
    this.defaultEndDate = aggregatedBoundaries.mostFrequentEndDate;

    if (
      aggregatedBoundaries.startAmount !== 1 ||
      aggregatedBoundaries.endAmount !== 1
    ) {
      this.showAdvancedBoundaries = true;
    }
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
  // amount of unique start- and endDates
  private aggregateAssigneeBoundaries() {
    const boundaryFrequencies = this.currentTaskAssignees.reduce(
      (acc, cTA) => {
        const cTAStartDate = cTA.start.toDateString();
        if (!acc.start[cTAStartDate]) {
          acc.start[cTAStartDate] = 1;
        } else {
          acc.start[cTAStartDate]++;
        }

        const cTAEndDate = cTA.end.toDateString();
        if (!acc.end[cTAEndDate]) {
          acc.end[cTAEndDate] = 1;
        } else {
          acc.end[cTAEndDate]++;
        }

        return acc;
      },
      { start: {}, end: {} }
    );

    const mostFrequentStartDate = new Date(
      this.getMostFrequent(boundaryFrequencies.start)
    );
    const mostFrequentEndDate = new Date(
      this.getMostFrequent(boundaryFrequencies.end)
    );
    const startAmount = Object.keys(boundaryFrequencies.start).length;
    const endAmount = Object.keys(boundaryFrequencies.end).length;

    return {
      mostFrequentStartDate,
      mostFrequentEndDate,
      startAmount,
      endAmount
    };
  }

  // sort descending in order of frequency and return first value
  private getMostFrequent(frequencyDict) {
    return Object.keys(frequencyDict).sort(
      (date1, date2) => frequencyDict[date2] - frequencyDict[date1]
    )[0];
  }
}
