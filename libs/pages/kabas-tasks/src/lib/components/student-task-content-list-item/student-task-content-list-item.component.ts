import { Component, Input } from '@angular/core';
import { ResultStatus } from '@campus/dal';
import { FileIconComponent } from '@campus/ui';

@Component({
  selector: 'campus-student-task-content-list-item',
  templateUrl: './student-task-content-list-item.component.html',
  styleUrls: ['./student-task-content-list-item.component.scss']
})
export class StudentTaskContentListItemComponent {
  public resultStatuses = ResultStatus;

  @Input() fileIcon: FileIconComponent;
  @Input() title: string;
  @Input() description?: string;
  @Input() isFinished: boolean;
  @Input() lastUpdated: Date;
  @Input() score: number;
  @Input() result: ResultStatus;
  @Input() actions: {
    label: string;
    handler: () => any; //prevents warning "Member handler is not callable in template"
  }[];

  public onActionClick(action) {
    console.log(action);
  }
}
