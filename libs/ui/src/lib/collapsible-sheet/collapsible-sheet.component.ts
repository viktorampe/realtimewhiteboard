import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'campus-collapsible-sheet',
  templateUrl: './collapsible-sheet.component.html',
  styleUrls: ['./collapsible-sheet.component.scss'],
  animations: [
    trigger('collapseExpand', [
      transition('false => true', [
        animate('200ms ease-in', style({ width: '15%' }))
      ]),
      transition('true => false', [
        animate('200ms ease-in', style({ width: '40%' }))
      ]),
      state('true', style({ width: '15%' })),
      state('false', style({ width: '40%' }))
    ]),
    trigger('rotate', [
      transition('false => true', [
        animate('200ms ease-in-out', style({ transform: 'rotate(180deg)' }))
      ]),
      transition('true => false', [
        animate('200ms ease-in', style({ transform: 'rotate(-180deg)' }))
      ]),
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' }))
    ])
  ]
})
export class CollapsibleSheetComponent {
  collapsed = true;

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
