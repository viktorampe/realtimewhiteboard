import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResultStatus } from '@campus/dal';
import { ContentActionInterface } from '@campus/shared';

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
  @Input() actions: ContentActionInterface[];
  @Input() isRequired: boolean;

  @Output() clickAction = new EventEmitter<ContentActionInterface>();

  public onActionClick(action: ContentActionInterface) {
    if (!action) {
      return;
    }
    this.clickAction.emit(action);
  }
}
