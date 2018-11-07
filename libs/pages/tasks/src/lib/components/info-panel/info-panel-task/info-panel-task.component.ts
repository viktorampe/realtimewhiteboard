import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-info-panel-task',
  templateUrl: './info-panel-task.component.html',
  styleUrls: ['./info-panel-task.component.scss']
})
export class InfoPanelTaskComponent {
  @Input()
  task: {
    name: string;
    description: string;
    teacher: { displayName: string };
    start: Date;
  };
}
