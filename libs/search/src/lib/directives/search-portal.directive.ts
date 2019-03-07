import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[campusSearchPortal], [searchPortal]'
})
export class SearchPortalDirective {
  @Input() searchPortal: string;

  constructor(public viewContainerRef: ViewContainerRef) {}
}
