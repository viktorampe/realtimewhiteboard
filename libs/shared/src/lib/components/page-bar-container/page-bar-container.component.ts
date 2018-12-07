import { CdkPortal, DomPortalHost, PortalHost } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnDestroy,
  ViewChild
} from '@angular/core';

/**
 * if the `campus-header` component is used,
 * the content of the `campus-page-bar` element will be projected inside the page-bar div of the `campus-header` component
 *
 * scss for the content is managed in the `campus-header` component under the `.shared-header { &__page-bar {} }` ruleset
 * @example
    <campus-page-bar>
      <campus-filter-text-input theme="dark"
                                (filterTextChange)="onChangeFilterInput($event)"
                                [filterText]="filterInput$|async"
                                class="pages__toolbar__filter"></campus-filter-text-input>
      <div class="divider"></div>
      <campus-button [iconClass]="'timeline'"
                    (click)="setListFormat(listFormat.LINE)"></campus-button>
      <campus-button [iconClass]="'checklist'"
                    (click)="setListFormat(listFormat.GRID)"></campus-button>
    </campus-page-bar>
 *
 * @export
 * @class PageBarContainerComponent
 * @implements {AfterViewInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'campus-page-bar',
  templateUrl: './page-bar-container.component.html',
  styleUrls: ['./page-bar-container.component.scss']
})
export class PageBarContainerComponent implements AfterViewInit, OnDestroy {
  private portalHost: PortalHost;
  @ViewChild(CdkPortal) portal;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

  ngAfterViewInit(): void {
    // Create a portalHost from a DOM element
    this.portalHost = this.getPortalHost('#page-bar-container');
    // Attach portal to host
    this.portalHost.attach(this.portal);
  }

  ngOnDestroy(): void {
    this.portalHost.detach();
  }

  private getPortalHost(selector: string) {
    //TODO  e2e test, see https://github.com/diekeure/campus/issues/206
    return new DomPortalHost(
      document.querySelector(selector),
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
  }
}
