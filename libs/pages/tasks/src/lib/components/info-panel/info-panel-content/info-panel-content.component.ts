import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-info-panel-content',
  templateUrl: './info-panel-content.component.html',
  styleUrls: ['./info-panel-content.component.scss']
})
export class InfoPanelContentComponent {
  @Input() content: TaskInfoPanelContentInterface;
}

export interface TaskInfoPanelContentInterface {
  name: string;
  description: string;
  extension: string;
  productType: string;
  methods: string[];
}
