import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-info-panel-educontent-preview',
  templateUrl: './content-preview.component.html',
  styleUrls: ['./content-preview.component.scss']
})
export class ContentPreviewComponent {
  @Input() preview: string;
  @Input() titleText: string;
  @Input() description: string;
  @Input() productTypeIcon: string;
  @Input() fileExtentionIcon: string;
  @Input() methods: string[];
}
