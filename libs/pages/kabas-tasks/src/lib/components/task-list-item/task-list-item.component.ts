import { Component, HostBinding, Input, OnInit } from '@angular/core';

// TODO import interfaces when PR #1376 is merged
export enum AssigneeType {
  'CLASSGROUP' = 'classGroup',
  'GROUP' = 'group',
  'STUDENT' = 'student'
}
export interface AssigneeInterface {
  type: AssigneeType;
  label: string;
  start: Date;
  end: Date;
}

export type Status = 'pending' | 'active' | 'finished';

@Component({
  selector: 'campus-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss']
})
export class TaskListItemComponent implements OnInit {
  public classGroups: AssigneeInterface[] = [];
  public groups: string[] = [];
  public students: string[] = [];

  private _assignees: AssigneeInterface[];

  @Input() title: string;
  @Input() learningArea: string;
  @Input() archived: boolean;
  @Input() icon: string;
  @Input() exerciseCount: number;
  @Input() startDate: Date;
  @Input() endDate: Date;
  @Input() status: Status;
  @Input() actions: { label: string; handler: Function }[];
  @Input()
  set assignees(assignees: AssigneeInterface[]) {
    this._assignees = assignees.sort(this.sortByType);
    this.classGroups = assignees.filter(
      assignee => assignee.type === AssigneeType.CLASSGROUP
    );
    this.groups = assignees
      .filter(assignee => assignee.type === AssigneeType.GROUP)
      .map(assignee => assignee.label);
    this.students = assignees
      .filter(assignee => assignee.type === AssigneeType.STUDENT)
      .map(assignee => assignee.label);
  }
  get assignees() {
    return this._assignees;
  }

  @HostBinding('class.manage-kabas-tasks-task-list-item')
  taskListItemClass = true;

  ngOnInit() {}

  private sortByType(a: AssigneeInterface, b: AssigneeInterface): number {
    const order = {
      [AssigneeType.CLASSGROUP]: 1,
      [AssigneeType.GROUP]: 2,
      [AssigneeType.STUDENT]: 3
    };
    if (order[a.type] === order[b.type]) {
      // same group: sort alphabetically
      if (a.label < b.label) {
        return -1;
      }
      return 1;
    }
    return order[a.type] - order[b.type];
  }
}
