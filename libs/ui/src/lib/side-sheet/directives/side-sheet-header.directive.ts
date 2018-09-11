import { Directive } from '@angular/core';
/**
 * Header section of a side sheet, needed as it's used as a selector.
 *
 * @export
 * @class SideSheetHeaderDirective
 */
@Directive({
  selector: '[campusSideSheetHeader], `campus-side-sheet-header`'
})
export class SideSheetHeaderDirective {
  constructor() {}
}
