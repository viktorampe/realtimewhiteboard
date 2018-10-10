import { Component, HostListener, Input } from '@angular/core';

/**
 * Generic button
 * Standard styles are applied with directives: border, disabled, rounded,
 * tooltip(with string), warning and danger.
 * The icon css class is set in [iconClass].
 *
 * @export
 * @class ButtonComponent
 */
@Component({
  selector: 'campus-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() iconClass: string;

  // Stops click event propagation inside component
  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }
}
