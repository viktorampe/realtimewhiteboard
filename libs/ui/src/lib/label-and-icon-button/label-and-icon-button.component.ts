import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-label-and-icon-button',
  templateUrl: './label-and-icon-button.component.html',
  styleUrls: ['./label-and-icon-button.component.scss']
})
export class LabelAndIconButtonComponent {
  @Input() label: string;
  @Input() icon: string;
  @Input() iconBackgroundColor: 'red' | 'gray' = 'red';
  @Output() iconClicked = new EventEmitter<string>();

  onIconClicked(): void {
    this.iconClicked.emit(this.label);
  }
}
