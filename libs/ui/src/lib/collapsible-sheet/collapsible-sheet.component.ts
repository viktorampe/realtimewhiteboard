import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'campus-collapsible-sheet',
  templateUrl: './collapsible-sheet.component.html',
  styleUrls: ['./collapsible-sheet.component.scss'],
  animations: [
    trigger('collapseExpand', [
      transition('xsmall-false => xsmall-true', [
        animate('200ms ease-in', style({ width: '5%' }))
      ]),
      state('xsmall-true', style({ width: '5%' })),
      transition('xsmall-true => xsmall-false', [
        animate('200ms ease-in', style({ width: '95%' }))
      ]),
      state('xsmall-false', style({ width: '95%' })),
      transition('small-false => small-true', [
        animate('200ms ease-in', style({ width: '15%' }))
      ]),
      state('small-true', style({ width: '15%' })),
      transition('small-true => small-false', [
        animate('200ms ease-in', style({ width: '50%' }))
      ]),
      state('small-false', style({ width: '50%' })),
      transition('medium-false => medium-true', [
        animate('200ms ease-in', style({ width: '15%' }))
      ]),
      state('medium-true', style({ width: '15%' })),
      transition('medium-true => medium-false', [
        animate('200ms ease-in', style({ width: '40%' }))
      ]),
      state('medium-false', style({ width: '40%' })),
      transition('large-false => large-true', [
        animate('200ms ease-in', style({ width: '20%' }))
      ]),
      state('large-true', style({ width: '20%' })),
      transition('large-true => large-false', [
        animate('200ms ease-in', style({ width: '50%' }))
      ]),
      state('large-false', style({ width: '50%' }))
    ]),
    trigger('rotate', [
      transition('false => true', [
        animate('200ms ease-in', style({ transform: 'rotate(180deg)' }))
      ]),
      transition('true => false', [
        animate('200ms ease-in', style({ transform: 'rotate(0deg)' }))
      ]),
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' }))
    ])
  ]
})
export class CollapsibleSheetComponent {
  collapsed = true;

  constructor(public breakpointObserver: BreakpointObserver) {}

  collapseExpandState(): string {
    return `${this.breakPointSize()}-${this.collapsed}`;
  }

  private breakPointSize(): string {
    return this.breakpointObserver.isMatched('(max-width: 599.99px)')
      ? 'xsmall'
      : this.breakpointObserver.isMatched(
          '(min-width: 600px) and (max-width: 959.99px)'
        )
      ? 'small'
      : this.breakpointObserver.isMatched(
          '(min-width: 960px) and (max-width: 1279.99px)'
        )
      ? 'medium'
      : 'large';
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}

// $ui-breakpoint-xsmall: '(max-width: 599.99px)';
// $ui-breakpoint-small: '(min-width: 600px) and (max-width: 959.99px)';
// $ui-breakpoint-medium: '(min-width: 960px) and (max-width: 1279.99px)';
// $ui-breakpoint-large: '(min-width: 1280px) and (max-width: 1919.99px)';
// $ui-breakpoint-xlarge: '(min-width: 1920px)';
// $ui-breakpoint-handset: '(max-width: 599.99px) and (orientation: portrait), (max-width: 959.99px) and (orientation: landscape)';
// $ui-breakpoint-tablet: '(min-width: 600px) and (max-width: 839.99px) and (orientation: portrait), (min-width: 960px) and (max-width: 1279.99px) and (orientation: landscape)';
// $ui-breakpoint-web: '(min-width: 840px) and (orientation: portrait), (min-width: 1280px) and (orientation: landscape)';
// $ui-breakpoint-handsetportrait: '(max-width: 599.99px) and (orientation: portrait)';
// $ui-breakpoint-tabletportrait: '(min-width: 600px) and (max-width: 839.99px) and (orientation: portrait)';
// $ui-breakpoint-webportrait: '(min-width: 840px) and (orientation: portrait)';
// $ui-breakpoint-handsetlandscape: '(max-width: 959.99px) and (orientation: landscape)';
// $ui-breakpoint-tabletlandscape: '(min-width: 960px) and (max-width: 1279.99px) and (orientation: landscape)';
// $ui-breakpoint-weblandscape: '(min-width: 1280px) and (orientation: landscape)';
