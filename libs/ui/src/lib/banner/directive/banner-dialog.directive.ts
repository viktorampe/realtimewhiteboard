import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusDialog],[dialog],[dialog]'
})
export class DialogDirective {
  @HostBinding('class.ui-banner--dialog')
  get isDialogClass() {
    return true;
  }
}
