import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusSecondary],[secondary]'
})
export class SecondaryDirective {
  @HostBinding('class.ui-button--secondary')
  get isSecondaryClass() {
    return true;
  }
}
