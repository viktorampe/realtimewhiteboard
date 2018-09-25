import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-info-panel-content',
  templateUrl: './info-panel-content.component.html',
  styleUrls: ['./info-panel-content.component.scss']
})
export class InfoPanelContentComponent {
  @Input()
  content: {
    preview?: string;
    name: string;
    description: string;
    extention: string;
    productType: string;
    methods: string[];
    status: string;
  };
  @Input() statusOptions: string[];
  @Output() saveStatus = new EventEmitter<string>();

  onSaveStatus(event): void {
    this.saveStatus.emit(event);
  }
}
