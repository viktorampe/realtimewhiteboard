import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent {
  @Input() fixed: string;
}
