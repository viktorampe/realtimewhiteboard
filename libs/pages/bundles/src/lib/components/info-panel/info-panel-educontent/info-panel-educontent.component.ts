import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-info-panel-educontent',
  templateUrl: './info-panel-educontent.component.html',
  styleUrls: ['./info-panel-educontent.component.scss']
})
export class InfoPanelEducontentComponent {
  @Input() content: {
    preview?: string,
    name: string,
    description: string,
    extention: string,
    productType: string,
    methods: string[],
    status: string
  };
  @Input() statusOptions: string[];
  @Output() saveStatus = new EventEmitter<string>();

  onSaveStatus(event): void {
    this.saveStatus.emit(event);
  }
}
