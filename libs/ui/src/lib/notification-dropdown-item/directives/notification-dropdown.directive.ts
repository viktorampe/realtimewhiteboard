import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusDropdown],[dropdown]'
})
export class DropdownDirective {
  @HostBinding('class.ui-notification-dropdown-item--dropdown')
  get isDropdownClass() {
    return true;
  }
}
