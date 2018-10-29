import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusVisible],[visible]'
})
export class VisibleDirective {
  @HostBinding('class.ui-button--visible')
  get isVisibleClass() {
    return true;
  }
}
