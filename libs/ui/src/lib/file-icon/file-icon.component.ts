import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-file-icon',
  templateUrl: './file-icon.component.html',
  styleUrls: ['./file-icon.component.scss']
})
export class FileIconComponent {
  @Input() svgIcon = '';
  @Input() title = '';
}
