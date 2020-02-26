import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusFlat],[button-flat],[flat]'
})
export class FlatDirective {
  @HostBinding('class.ui-button--flat') isFlatClass = true;
}
