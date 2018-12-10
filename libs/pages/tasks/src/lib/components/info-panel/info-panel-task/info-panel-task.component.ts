import { Component, Input } from '@angular/core';
import { BadgePersonInterface } from '@campus/ui';
import { TaskWithInfoInterface } from '../../tasks.viewmodel.interfaces';

@Component({
  selector: 'campus-info-panel-task',
  templateUrl: './info-panel-task.component.html',
  styleUrls: ['./info-panel-task.component.scss']
})
export class InfoPanelTaskComponent {
  @Input() person: BadgePersonInterface;
  @Input() taskInfo: TaskWithInfoInterface;
}
