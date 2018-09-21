import { Component, Input } from '@angular/core';
/**
 * Presents the logo of a method.
 *
 * @param {string} className - The Css classname associated with the method.
 * @param {string} colorMode - Sets the color of the icon. Accepted values: 'grey', 'color' and 'hover'(default).
 * @param {string} altText - Sets the value of the (invisible) textcontent.
 *
 * @export
 * @class MethodLogoComponent
 */
@Component({
  selector: 'campus-method-logo',
  templateUrl: './method-logo.component.html',
  styleUrls: ['./method-logo.component.scss']
})
export class MethodLogoComponent {
  @Input() methodClass = '';
  @Input() colorMode: 'grey' | 'color' | 'hover';
  @Input() altText = '';

  public get colorClass(): string {
    let className: string;
    switch (this.colorMode) {
      case 'color':
        className = 'ui-method__logo--color';
        break;

      case 'grey':
        className = 'ui-method__logo--grey';
        break;

      default:
        className = 'ui-method__logo--hover';
    }
    return className;
  }
}
