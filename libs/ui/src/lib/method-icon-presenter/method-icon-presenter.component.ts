import { Component, OnInit, Input, HostBinding } from '@angular/core';
/**
 * Presents the logo of a method.
 *
 * @param {string} className - The Css classname associated with the method.
 * @param {string} colorMode - Sets the color of the icon. Accepted values: 'grey', 'color' and 'hover'(default).
 *
 * @export
 * @class MethodIconPresenterComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'campus-method-icon-presenter',
  templateUrl: './method-icon-presenter.component.html',
  styleUrls: ['./method-icon-presenter.component.scss']
})
export class MethodIconPresenterComponent implements OnInit {
  @Input() methodClass = '';
  @Input() colorMode: 'grey' | 'color' | 'hover';

  public get colorClass(): string {
    let className: string;
    switch (this.colorMode) {
      case 'color':
        className = 'method__icon--color';
        break;

      case 'grey':
        className = 'method__icon--grey';
        break;

      case 'hover':
        className = 'method__icon--hover';
        break;

      default:
        className = 'method__icon--hover';
    }
    return className;
  }

  constructor() {}

  ngOnInit() {}
}
