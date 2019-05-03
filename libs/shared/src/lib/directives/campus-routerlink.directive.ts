import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input
} from '@angular/core';
import { Router } from '@angular/router';
import { WINDOW } from '@campus/browser';

@Directive({
  selector: '[campusRouterLink]'
})
export class CampusRouterlinkDirective {
  @Input()
  campusRouterLink: string;

  constructor(
    private eltRef: ElementRef,
    private router: Router,
    @Inject(WINDOW) private window: Window
  ) {}

  @HostListener('click')
  onClick() {
    this.navigateToLink(this.campusRouterLink);
  }

  navigateToLink(linkPath: string) {
    const externalLink = this.getExternalLink(linkPath);
    if (externalLink) {
      this.window.open(externalLink, '_blank');
      return;
    }
    this.router.navigateByUrl(linkPath);
  }

  getExternalLink(linkPath: string): string {
    const currentDomain = this.window.location.origin;
    if (linkPath.substr(0, currentDomain.length) === currentDomain) {
      return null;
    }
    const rxp = new RegExp(
      "([a-z][a-z0-9+.-]*):(?:\\/\\/((?:(?=((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*))(\\3)@)?(?=(\\[[0-9A-F:.]{2,}\\]|(?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*))\\5(?::(?=(\\d*))\\6)?)(\\/(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\8)?|(\\/?(?!\\/)(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\10)?)(?:\\?(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\11)?(?:#(?=((?:[a-z0-9-._~!$&'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\12)?",
      'i'
    );
    const matches = linkPath.match(rxp);
    return matches ? matches[0] : null;
  }
}
