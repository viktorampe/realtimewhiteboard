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
 * if the campus-header component is used,
 * the content of the campus-page-bar element will be projected inside the page-bar div of the campus-header component
 * @example
 * <campus-page-bar>
 *  content that will be projected
 * </campus-page-bar>
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
    this.portalHost = new DomPortalHost(
      document.querySelector('#page-bar-container'),
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
    // Attach portal to host
    this.portalHost.attach(this.portal);
  }

  ngOnDestroy(): void {
    this.portalHost.detach();
  }
}
