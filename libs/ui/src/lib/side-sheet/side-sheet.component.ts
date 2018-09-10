import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter, takeWhile } from 'rxjs/operators';
/**
 * Surface containing supplementary content that is anchored to the left or right edge of the screen.
 * Side sheets contain content that supplements the screen's primary UI region.
 * Side sheets display a wide variety of content and layouts through content projection.
 * Side sheet itself sets it's display mode:
 * - side (default): sheet appears side-by-side with the main content, shrinking the main content's width to make space for the sidenav
 * - over (small screen sizes): sheet floats over the primary content, which is covered by a backdrop
 * Material reference: https://material.io/design/components/sheets-side.html#
 * @export
 * @class SideSheetComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'campus-side-sheet',
  templateUrl: './side-sheet.component.html',
  styleUrls: ['./side-sheet.component.scss']
})
export class SideSheetComponent implements OnInit, OnDestroy {
  @Input()
  set isOpen(value) {
    this.sheet.open();
  }

  @ViewChild(MatDrawer) sheet: MatDrawer;
  /**
   * Whether the component is still rendered.
   * Used for unsubscribing from subscriptions.
   *
   * @memberof SideSheetComponent
   */
  isAlive = true;

  /**
   * Stream of XSmall breakpoint events.
   *
   * @memberof SideSheetComponent
   */
  xSmall$ = this.breakPointObserver.observe([Breakpoints.XSmall]);
  /**
   * Stream of various breakpoint events.
   *
   * @memberof SideSheetComponent
   */
  other$ = this.xSmall$.pipe(filter(result => !result.matches));

  constructor(private breakPointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    // sheet property available in the OnInit life cycle
    this.xSmall$
      .pipe(
        takeWhile(() => this.isAlive),
        filter(result => result.matches)
      )
      .subscribe(() => {
        this.sheet.mode = 'over';
      });
    this.other$.pipe(takeWhile(() => this.isAlive)).subscribe(() => {
      this.sheet.mode = 'side';
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
