import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-info-panel-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class InfoPanelActionComponent {
  @Input() actionText: string;
  @Input() icon: string;
  @Input() iconBackgroundColor: 'red' | 'gray' = 'red';
  @Output() iconClicked = new EventEmitter<string>();

  onIconClicked(): void {
    this.iconClicked.emit(this.actionText);
  }
}
