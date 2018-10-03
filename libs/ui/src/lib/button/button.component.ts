import { Component, HostBinding, HostListener, Input } from '@angular/core';

@Component({
  selector: 'campus-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() iconClass: string;
  @Input() tooltip: string;
  @Input() isEnabled = true;

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.isEnabled) return;
  }

  @HostBinding('class.ui-button--disabled')
  get isDisabledClass() {
    return !this.isEnabled;
  }
}
