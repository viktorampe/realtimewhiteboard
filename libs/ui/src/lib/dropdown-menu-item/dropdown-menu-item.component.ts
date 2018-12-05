import { Component, Input } from '@angular/core';

export interface DropdownMenuItemInterface {
  header?: string;
  description?: string;
  icon?: string;
  image?: string;
  internalLink?: string;
  externalLink?: string;
  imageAltText?: string;
}
@Component({
  selector: 'campus-dropdown-menu-item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.scss']
})
export class DropdownMenuItemComponent implements DropdownMenuItemInterface {
  @Input() header: string;
  @Input() description: string;
  @Input() icon: string;
  @Input() image: string;
  @Input() internalLink: string;
  @Input() externalLink: string;
  @Input() imageAltText: string;
}
