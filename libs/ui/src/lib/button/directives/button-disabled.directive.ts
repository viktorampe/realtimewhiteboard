import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[campusDisabled],[button-disabled], [disabled]'
})
export class DisabledDirective {
  private _disabled: boolean;

  @HostBinding('class.ui-button--disabled')
  @Input()
  set disabled(value: boolean | '') {
    this._disabled = value === '' || value;
  }
  get disabled() {
    return this._disabled;
  }
}
