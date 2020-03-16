import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input
} from '@angular/core';

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
  @Input() actions: {
    label: string;
    handler: () => any; //prevents warning "Member handler is not callable in template"
  }[];

  @HostBinding('class.manage-kabas-tasks__student-task-list-item')
  studentTaskListItemClass = true;
}
