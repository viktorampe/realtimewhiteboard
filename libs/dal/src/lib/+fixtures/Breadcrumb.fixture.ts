import { BreadcrumbLinkInterface } from '@campus/ui';

export class BreadcrumbLinkFixture implements BreadcrumbLinkInterface {
  displayText = 'breadcrumb link';
  link: any[] = ['/link'];
  constructor(props: Partial<BreadcrumbLinkInterface> = {}) {
    return Object.assign(this, props);
  }
}
