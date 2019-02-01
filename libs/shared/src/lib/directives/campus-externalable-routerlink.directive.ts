import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[campusExternalableRouterlink]'
})
export class CampusExternalableRouterlinkDirective {
  @Input()
  campusRouterLink: string;

  constructor(private eltRef: ElementRef, private router: Router) {}

  @HostListener('click')
  onClick() {
    this.navigateToLink(this.campusExternalableRouterlink);
  }

  navigateToLink(linkPath: string) {
    const externalLink = this.getExternalLink(linkPath);
    if (externalLink) {
      window.open(externalLink, '_blank');
      return;
    }
    this.router.navigateByUrl(linkPath);
  }

  getExternalLink(linkPath: string): string {
    const rxp = /([a-z][a-z0-9+.-]*):(?:\/\/((?:(?=((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*))(\3)@)?(?=(\[[0-9A-F:.]{2,}\]|(?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*))\5(?::(?=(\d*))\6)?)(\/(?=((?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*))\8)?|(\/?(?!\/)(?=((?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*))\10)?)(?:\?(?=((?:[a-z0-9-._~!$&'()*+,;=:@\/?]|%[0-9A-F]{2})*))\11)?(?:#(?=((?:[a-z0-9-._~!$&'()*+,;=:@\/?]|%[0-9A-F]{2})*))\12)?/i;
    const matches = linkPath.match(rxp);
    if (matches && matches.length > 0) {
      if (matches[0]) {
        const path = matches[0];
        // path should be an external url so we open it in a new tab.
        return path;
      }
    }
    return '';
  }
}
