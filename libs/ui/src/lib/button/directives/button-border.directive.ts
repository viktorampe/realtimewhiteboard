import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusBorder],[bordered],[border],[default]'
})
export class BorderDirective {
  @HostBinding('class.ui-button--bordered')
  get isBorderedClass() {
    return true;
  }
}
