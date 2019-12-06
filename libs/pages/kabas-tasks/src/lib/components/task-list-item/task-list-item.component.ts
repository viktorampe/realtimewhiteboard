import { Component, Input, OnInit } from '@angular/core';

// TODO import interfaces when PR #1376 is merged
enum AssigneeType {
  'CLASSGROUP' = 'classGroup',
  'GROUP' = 'group',
  'STUDENT' = 'student'
}
interface AssigneeInterface {
  type: AssigneeType;
  label: string;
  start: Date;
  end: Date;
}

type Status = 'pending' | 'active' | 'finished';

@Component({
  selector: 'campus-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss']
})
export class TaskListItemComponent implements OnInit {
  public dates: { startDate: Date; endDate: Date; status: Status };

  private _assignees: AssigneeInterface[];

  @Input() title: string;
  @Input()
  set assignees(assignees: AssigneeInterface[]) {
    this._assignees = assignees.sort(this.sortByType);
  }
  get assignees() {
    return this._assignees;
  }
  @Input() learningArea: string;
  @Input() archived: boolean;
  @Input() icon: string;
  @Input() exerciseCount: number;
  @Input() startDate: Date;
  @Input() endDate: Date;
  @Input() status: Status;

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
