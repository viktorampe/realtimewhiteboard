import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class InfoPanelStatusComponent {
  @Input() states: { name: string, id: number };
  @Output() saveStatus = new EventEmitter<number>();
}
