import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-tool-bar-button',
  templateUrl: './tool-bar-button.component.html',
  styleUrls: ['./tool-bar-button.component.scss']
})
export class ToolBarButtonComponent {
  @Input() icon: string;
  @Input() title: string;
  @Input() active = false;
}
