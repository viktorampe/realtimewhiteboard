import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter, takeWhile } from 'rxjs/operators';
/**
 * Surface containing supplementary content that is anchored to the right edge of the screen.
 * Side sheets contain content that supplements the screen's primary UI region.
 * Side sheets display a wide variety of content and layouts through content projection.
 * Side sheet itself determines it's display mode:
 * - side (default): the sheet appears side-by-side with the main content, shrinking the main content's width to make space for the sidenav
 * - over (small screen sizes): the sheet floats over the primary content, which is covered by a backdrop
 * Material reference: https://material.io/design/components/sheets-side.html#
 *
 * A side sheet has 3 sections:
 *  - header: styled title with close action
 *  - body: various content rendered in the side sheet
 *  - page: the page content which interacts with the side sheet (e.g. the sheet can slide over this page content or is displayed side-by-side)
 *
 * @example
 *  <campus-side-sheet [isOpen]="true">
 *    <campus-side-sheet-header>This is the header of the side sheet.</campus-side-sheet-header>
 *    <campus-side-sheet-body>
 *      <div>This is the sheet body</div>
 *    </campus-side-sheet-body>
 *    <campus-side-sheet-page>
 *      <div>This is a the page which interacts with the side sheet.</div>
 *    </campus-side-sheet-page>
 *  </campus-side-sheet>
 * @example
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
  /**
   * Reference to the material drawer component.
   * Used to set it's properties in code (instead of in the template).
   *
   * @type {MatDrawer}
   * @memberof SideSheetComponent
   */
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
   * Stream of non XSmall breakpoint events.
   *
   * @memberof SideSheetComponent
   */
  other$ = this.xSmall$.pipe(filter(result => !result.matches));

  constructor(private breakPointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
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
