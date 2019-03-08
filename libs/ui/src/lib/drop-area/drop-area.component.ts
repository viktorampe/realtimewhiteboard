import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-drop-area',
  templateUrl: './drop-area.component.html',
  styleUrls: ['./drop-area.component.scss']
})
export class DropAreaComponent {
  @Input() icon: string;
  @Input() message: string;
}
