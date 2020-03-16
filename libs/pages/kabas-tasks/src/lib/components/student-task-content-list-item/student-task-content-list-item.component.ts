import { Component, Input } from '@angular/core';
import { ResultStatus } from '@campus/dal';

@Component({
  selector: 'campus-student-task-content-list-item',
  templateUrl: './student-task-content-list-item.component.html',
  styleUrls: ['./student-task-content-list-item.component.scss']
})
export class StudentTaskContentListItemComponent {
  public resultStatuses = ResultStatus;

  @Input() fileIcon: string;
  @Input() title: string;
  @Input() description?: string;
  @Input() isFinished: boolean;
  @Input() lastUpdated: Date;
  @Input() score: number;
  @Input() status: ResultStatus;
  @Input() actions: {
    label: string;
    handler: () => any; //prevents warning "Member handler is not callable in template"
  }[];

  public onActionClick(action) {
    console.log(action);
  }
}
