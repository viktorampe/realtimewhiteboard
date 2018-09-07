import { Component, OnInit, Input } from '@angular/core';

/**
 * Styles the page header.
 *
 * @export
 * @class PageHeaderComponent
 * @implements {OnInit}
 *
 * @param {string} [iconClass] - Css classname for icon
 */
@Component({
  selector: 'campus-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component-theme.scss']
})
export class PageHeaderComponent implements OnInit {
  @Input() iconClass: string;
  @Input() title: string;
  @Input() subtitle: string;

  constructor() {}

  ngOnInit() {}
}
