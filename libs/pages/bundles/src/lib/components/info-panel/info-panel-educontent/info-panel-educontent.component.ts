import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-info-panel-educontent',
  templateUrl: './info-panel-educontent.component.html',
  styleUrls: ['./info-panel-educontent.component.scss']
})
export class InfoPanelEducontentComponent {
  @Input() eduContentPreview: string;
  @Input() eduContentName: string;
  @Input() eduContentDescription: string;
  @Input() eduContentExtention: string;
  @Input() eduContentProductType: string;
  @Input() eduContentMethods: string;
  @Input() statusOptions: string;
  @Input() selectedStatus: string;
  @Input() statusConfirmIcon: string;
  @Output() saveStatus = new EventEmitter<string>();

  onSaveStatus(event): void {
    this.saveStatus.emit(event);
  }
}
