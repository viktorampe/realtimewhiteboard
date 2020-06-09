import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusFab],[button-fab],[fab]'
})
export class FabDirective {
  @HostBinding('class.ui-button--fab') isFabClass = true;
}
