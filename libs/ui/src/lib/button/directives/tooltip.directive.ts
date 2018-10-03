import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[campusTooltip],[tooltip]'
})
export class TooltipDirective {
  @Input() tooltip = true;

  @HostBinding('attr.title')
  get getTooltip() {
    return this.tooltip;
  }
}
