import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import { TaskActionInterface } from '@campus/shared';

@Component({
  selector: 'campus-student-task-list-item',
  templateUrl: './student-task-list-item.component.html',
  styleUrls: ['./student-task-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentTaskListItemComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() learningAreaName: string;
  @Input() dateLabel: string;
  @Input() completedRequired: number;
  @Input() totalRequired: number;
  @Input() urgent: boolean;
  @Input() finished: boolean;
  @Input() actions: TaskActionInterface[];
  @Output() clickAction = new EventEmitter<TaskActionInterface>();

  @HostBinding('class.student-task-list-item')
  studentTaskListItemClass = true;

  onActionClick(action: TaskActionInterface) {
    this.clickAction.emit(action);
  }
}
