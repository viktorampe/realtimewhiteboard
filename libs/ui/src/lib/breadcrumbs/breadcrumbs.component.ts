import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  @Input() seperator: String = 'seperator';
  @Input() breadCrumbs: BreadcumbLinkInterface[] = [];
  @Input() homeIcon: String = 'home';
  @Input() hidden: String = '...';
  @Input() maxLen: number;
}

export interface BreadcumbLinkInterface {
  displayText: String;
  href: String;
}
