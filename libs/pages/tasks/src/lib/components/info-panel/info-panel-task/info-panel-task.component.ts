import { Component, Input } from '@angular/core';
import { TaskInstanceInterface } from '@campus/dal';
import { BadgePersonInterface } from '@campus/ui';

@Component({
  selector: 'campus-info-panel-task',
  templateUrl: './info-panel-task.component.html',
  styleUrls: ['./info-panel-task.component.scss']
})
export class InfoPanelTaskComponent {
  @Input() person: BadgePersonInterface;
  @Input() taskInstance: TaskInstanceInterface;
}
