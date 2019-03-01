import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input } from '@angular/core';

const defaultBreakpoints = {
  'xsmall-closed': '5%',
  'xsmall-open': '95%',
  'small-closed': '15%',
  'small-open': '50%',
  'medium-closed': '15%',
  'medium-open': '40%',
  'large-closed': '20%',
  'large-open': '50%'
};
const defaults = { params: defaultBreakpoints };

@Component({
  selector: 'campus-collapsible-sheet',
  templateUrl: './collapsible-sheet.component.html',
  styleUrls: ['./collapsible-sheet.component.scss'],
  animations: [
    trigger('collapseExpand', [
      // breakpoints (states)
      state('xsmall-closed', style({ width: '{{xsmall-closed}}' }), defaults),
      state('xsmall-open', style({ width: '{{xsmall-open}}' }), defaults),
      state('small-closed', style({ width: '{{small-closed}}' }), defaults),
      state('small-open', style({ width: '{{small-open}}' }), defaults),
      state('medium-closed', style({ width: '{{medium-closed}}' }), defaults),
      state('medium-open', style({ width: '{{medium-open}}' }), defaults),
      state('large-closed', style({ width: '{{large-closed}}' }), defaults),
      state('large-open', style({ width: '{{large-open}}' }), defaults),
      // animation
      transition('void => *', animate(0)), // start without animation
      transition('* => *', animate('200ms ease-in'))
    ]),
    trigger('rotate', [
      transition('void => *', animate(0)), // start without animation
      transition('* => *', animate('200ms ease-in')),
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' }))
    ])
  ]
})
export class CollapsibleSheetComponent {
  private _breakpoints;

  @Input() collapsed = true;
  @Input()
  set breakpoints(breakpoints: {
    'xsmall-open'?: string;
    'xsmall-closed'?: string;
    'small-open'?: string;
    'small-closed'?: string;
    'medium-closed'?: string;
    'medium-open'?: string;
    'large-closed'?: string;
    'large-open'?: string;
  }) {
    this._breakpoints = {
      ...defaultBreakpoints,
      ...(breakpoints || {})
    };
  }
  get breakpoints() {
    return this._breakpoints;
  }

  constructor(public breakpointObserver: BreakpointObserver) {}

  collapseExpandState(): string {
    return `${this.breakPointSize()}-${this.collapsed ? 'closed' : 'open'}`;
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
