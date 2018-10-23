import { CdkPortal, DomPortalHost, PortalHost } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'campus-page-bar',
  templateUrl: './page-bar-container.component.html',
  styleUrls: ['./page-bar-container.component.scss']
})
export class PageBarContainerComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private portalHost: PortalHost;
  @ViewChild(CdkPortal) portal;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

  ngOnInit() {}

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
