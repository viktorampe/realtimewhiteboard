import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusDense],[button-dense],[dense]'
})
export class DenseDirective {
  @HostBinding('class.ui-button--dense') isDenseClass = true;
}
