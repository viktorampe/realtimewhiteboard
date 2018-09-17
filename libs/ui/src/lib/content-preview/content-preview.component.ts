import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-content-preview',
  templateUrl: './content-preview.component.html',
  styleUrls: ['./content-preview.component.scss']
})
export class ContentPreviewComponent {
  @Input() preview: string;
  @Input() titleText: string;
  @Input() description: string;
}
