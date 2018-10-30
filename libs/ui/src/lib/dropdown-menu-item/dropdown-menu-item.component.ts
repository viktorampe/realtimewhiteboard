import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-dropdown-menu-item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.scss']
})
export class DropdownMenuItemComponent {
  @Input() title: string;
  @Input() header: string;
  @Input() icon: string;
  @Input() image: string;
  @Input() internalLink: string;
  @Input() externalLink: string;
  @Input() imageAltText: string;
}
