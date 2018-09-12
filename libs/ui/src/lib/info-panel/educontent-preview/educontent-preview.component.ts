import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-info-panel-educontent-preview',
  templateUrl: './educontent-preview.component.html',
  styleUrls: ['./educontent-preview.component.scss']
})
export class InfoPanelEducontentPreviewComponent {
  @Input() preview: string;
  @Input() titleText: string;
  @Input() description: string;
  @Input() productTypeIcon: string;
  @Input() fileExtentionIcon: string;
  @Input() methods: string[];
}