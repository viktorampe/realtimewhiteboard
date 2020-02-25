import { Directive, OnInit } from '@angular/core';
/**
 * Actions section of a side sheet, needed as it's used as a selector.
 *
 * @export
 * @class SideSheetActionsDirective
 */
@Directive({
  selector: '[campusSideSheetActions], campus-side-sheet-actions'
})
export class SideSheetActionsDirective implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
