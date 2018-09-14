import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-period-label',
  templateUrl: './period-label.component.html',
  styleUrls: ['./period-label.component.scss']
})
export class PeriodLabelComponent {
  @Input() titleText: string;
  @Input() period: { start: Date, end: Date };
  @Input() showIcons: boolean;
  @Output() editStart = new EventEmitter<boolean>();
  @Output() editEnd = new EventEmitter<boolean>();

  onEditStart() {
    this.editStart.emit(true);
  }

  onEditEnd() {
    this.editEnd.emit(true);
  }
}
