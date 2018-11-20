import { Component, Input } from '@angular/core';
import { ContentInterface } from '@campus/dal';

@Component({
  selector: 'campus-info-panel-content',
  templateUrl: './info-panel-content.component.html',
  styleUrls: ['./info-panel-content.component.scss']
})
export class InfoPanelContentComponent {
  @Input() content: ContentInterface;
}
