import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusIcon],[button-icon],[icon]'
})
export class IconDirective {
  @HostBinding('class.ui-button--icon') isIconClass = true;
}
