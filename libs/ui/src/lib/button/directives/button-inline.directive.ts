import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[campusInline],[button-inline], [inline]'
})
export class InlineDirective {
  @HostBinding('class.ui-button--inline') isInlineClass = true;
}
