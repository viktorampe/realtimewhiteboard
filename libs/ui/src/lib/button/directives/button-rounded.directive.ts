import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusRounded],[rounded]'
})
export class RoundedDirective {
  @HostBinding('class.ui-button--rounded')
  get isRoundedClass() {
    return true;
  }
}
