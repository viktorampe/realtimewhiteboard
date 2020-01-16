import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AssigneeInterface } from '../../interfaces/Assignee.interface';
import { ManageKabasTasksAssigneeDataInterface } from './manage-kabas-tasks-assignee-data.interface';

@Component({
  selector: 'campus-manage-kabas-tasks-assignee-modal',
  templateUrl: './manage-kabas-tasks-assignee-modal.component.html',
  styleUrls: ['./manage-kabas-tasks-assignee-modal.component.scss']
})
export class ManageKabasTasksAssigneeModalComponent implements OnInit {
  public showAddAssignees = false;
  public currentTaskName: string;
  public currentTaskAssignees: AssigneeInterface[];
  public availableTaskAssignees: AssigneeInterface[];
  public default: { start: Date; end: Date };
  public showAdvancedBoundaries = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: ManageKabasTasksAssigneeDataInterface,
    private dialogRef: MatDialogRef<ManageKabasTasksAssigneeModalComponent>
  ) {}

  ngOnInit() {
    // page assignees shouldn't be affected -> clone
    this.currentTaskAssignees = this.data.currentTaskAssignees.map(cTA => ({
      ...cTA
    }));
    this.currentTaskName = this.data.title;
    this.determineDefaultDateInterval();
    this.updateAvailableTaskAssignees();
  }

  public toggleAdvancedBoundaries() {
    this.showAdvancedBoundaries = !this.showAdvancedBoundaries;
  }

  public setDefaultDateRange(event: { start: Date; end: Date }) {
    this.currentTaskAssignees
      .filter(
        cTA =>
          cTA.start.getTime() === this.default.start.getTime() &&
          cTA.end.getTime() === this.default.end.getTime()
      )
      .forEach(cTA => {
        cTA.start = event.start;
        cTA.end = event.end;
      });

    this.default = event;
  }

  public toggleAddAssignees() {
    this.showAddAssignees = !this.showAddAssignees;
  }

  public addAssignees(assignees: AssigneeInterface[]) {
    // TODO event is click, for now
    // TODO use actual input

    const assigneesToAdd = assignees.map(tA => ({
      ...tA,
      ...this.default
    }));
    this.currentTaskAssignees.push(...assigneesToAdd);
    this.updateAvailableTaskAssignees();
  }

  public removeAssignee(assignee: AssigneeInterface) {
    this.currentTaskAssignees = this.currentTaskAssignees.filter(
      cTA => cTA !== assignee
    );
    this.updateAvailableTaskAssignees();
  }

  public setAssignmentDate(
    assignee: AssigneeInterface,
    event: { start: Date; end: Date }
  ) {
    assignee.start = event.start;
    assignee.end = event.end;
  }

  public setDefaultDate(assignee: AssigneeInterface) {
    Object.assign(assignee, this.default);
  }

  public onOKButtonClick() {
    this.dialogRef.close(this.currentTaskAssignees);
  }

  public onCancelButtonClick() {
    this.dialogRef.close();
  }

  public isDefaultDate(start: Date, end: Date): boolean {
    return (
      start.getTime() === this.default.start.getTime() &&
      end.getTime() === this.default.end.getTime()
    );
  }

  private updateAvailableTaskAssignees() {
    this.availableTaskAssignees = this.data.possibleTaskAssignees.filter(
      pTA =>
        !this.currentTaskAssignees.some(
          cTA => cTA.relationId === pTA.relationId && cTA.type === pTA.type
        )
    );
  }

  private determineDefaultDateInterval() {
    let start, end;

    // no assignees -> rest of schoolyear
    if (this.currentTaskAssignees.length === 0) {
      const today = new Date();
      const schoolYear = this.getSchoolYearBoundaries(today);

      start = today;
      end = schoolYear.end;
    } else {
      const aggregatedBoundaries = this.aggregateAssigneeBoundaries();

      // all assignees use same interval -> use he most frequent (i.e. only) value
      // if differing boundaries -> use the most frequent
      start = aggregatedBoundaries.mostFrequentStartDate;
      end = aggregatedBoundaries.mostFrequentEndDate;
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
