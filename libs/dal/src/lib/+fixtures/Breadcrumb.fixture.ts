import { BreadcrumbLinkInterface } from '@campus/ui';
import { of } from 'rxjs';

export class BreadcrumbLinkFixture implements BreadcrumbLinkInterface {
  displayText = of('breadcrumb link');
  link: any[] = ['/link'];
  constructor(props: Partial<BreadcrumbLinkInterface> = {}) {
    return Object.assign(this, props);
  }
}
