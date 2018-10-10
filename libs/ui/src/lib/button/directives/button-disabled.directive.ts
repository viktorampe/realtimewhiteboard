import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusDisabled],[disabled]'
})
export class DisabledDirective {
  @HostBinding('class.ui-button--disabled')
  get isDisabledClass() {
    return true;
  }
}
