import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'campus-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  @Input() seperator = 'seperator';
  @Input() breadCrumbs: BreadcrumbLinkInterface[] = [];
  @Input() baseIcon = 'home';
  @Input() overflowedLinkString = '…';
  @Input() maxLength = 99;
  @Input() baseUrl = '/';
}

export interface BreadcrumbLinkInterface {
  displayText: Observable<string>;
  link: any[]; // see routerlink docs
}
