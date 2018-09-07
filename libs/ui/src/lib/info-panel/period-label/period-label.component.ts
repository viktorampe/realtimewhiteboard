import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-info-panel-period-label',
  templateUrl: './period-label.component.html',
  styleUrls: ['./period-label.component.scss']
})
export class InfoPanelPeriodLabelComponent {
  @Input() title: string;
  @Input() period: { start: Date, end: Date };
  @Output() editStart = new EventEmitter<boolean>();
  @Output() editEnd = new EventEmitter<boolean>();

  onEditStart() {
    this.editStart.emit(true);
  }

  onEditEnd() {
    this.editEnd.emit(true);
  }
}
