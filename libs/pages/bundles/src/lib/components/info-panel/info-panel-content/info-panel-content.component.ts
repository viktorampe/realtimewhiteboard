import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentInterface } from '@campus/dal';
import { SelectOption } from '@campus/ui';

@Component({
  selector: 'campus-info-panel-content',
  templateUrl: './info-panel-content.component.html',
  styleUrls: ['./info-panel-content.component.scss']
})
export class InfoPanelContentComponent {
  @Input() content: ContentInterface;
  @Input() status: any;
  @Input() statusOptions: SelectOption[];
  @Output() saveStatus = new EventEmitter<string>();

  onSaveStatus(event): void {
    this.saveStatus.emit(event);
  }
}
