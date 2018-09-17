import { Directive, ElementRef, OnInit } from '@angular/core';
/**
 * Header section of a side sheet, needed as it's used as a selector.
 * Set's 'Info' as default value of none is present.
 *
 * @export
 * @class SideSheetHeaderDirective
 */
@Directive({
  selector: '[campusSideSheetHeader], `campus-side-sheet-header`'
})
export class SideSheetHeaderDirective implements OnInit {
  constructor(private el: ElementRef) {}
  ngOnInit(): void {
    // check both inner elements and plain text
    if (
      this.el.nativeElement.children.length === 0 &&
      this.el.nativeElement.innerHTML.length === 0
    ) {
      this.el.nativeElement.innerHTML = 'Info';
    }
  }
}
