import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer, MatIcon } from '@angular/material';
import { filter, takeWhile, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Component that acts a a skeleton for the app.
 * Contains placeholders for left-side content, logo, header-bar and body content
 * Handles responsiveness for the side content as well
 * @example
 * <campus-shell>
 *   <campus-shell-logo>
 *       <img src="logo.png" alt="Logo">
 *   </campus-shell-logo>
 *   <campus-shell-left>
 *       <ul>
 *           <li><a href="#">home</a></li>
 *           <li><a href="#">about</a></li>
 *       </ul>
 *   </campus-shell-left>
 *   <campus-shell-top>
 *       Home > dashboard
 *   </campus-shell-top>
 *   <h1>Hello world</h1>
 *   <p>Is it wrong to be strong?</p>
 * </campus-shell>
 */
@Component({
  selector: 'campus-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {
  /**
   * Whether the component is still rendered.
   * Used for unsubscribing from subscriptions.
   */
  private isAlive = true;

  /**
   * Reference to the material drawer component in the template
   *
   * @type {MatDrawer}
   */
  @ViewChild(MatDrawer) private sidebar: MatDrawer;

  /**
   * Stream of @media queries matching 'XSmall' breakpoint preset.
   */
  private xSmallMediaQuery$ = this.breakPointObserver.observe([
    Breakpoints.XSmall
  ]);

  constructor(private breakPointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    this.subscribeEnterXSmallBreakpoint();
    this.subscribeLeaveXSmallBreakpoint();
  }

  private subscribeLeaveXSmallBreakpoint() {
    this.xSmallMediaQuery$
      .pipe(
        takeWhile(() => this.isAlive),
        filter(result => !result.matches)
      )
      .subscribe(() => {
        this.sidebar.mode = 'side';
        this.sidebar.disableClose = true;
      });
  }

  protected get inXSmall$():Observable<Boolean> {
    return this.xSmallMediaQuery$
      .pipe(
        map(result => result.matches)
      )
  }

  private subscribeEnterXSmallBreakpoint() {
    this.xSmallMediaQuery$
      .pipe(
        takeWhile(() => this.isAlive),
        filter(result => result.matches)
      )
      .subscribe(() => {
        this.sidebar.mode = 'over';
        this.sidebar.disableClose = false;
      });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
