import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  @Input() seperator: String = 'seperator';
  @Input() breadCrumbs: BreadcumbLinkInterface[] = [];
  @Input() baseIcon: String = 'home';
  @Input() overflowedLinkString: String = '...';
  @Input() maxLength = 4;
  @Input() baseUrl: String = '/';

  constructor() {
    this.breadCrumbs = [
      { displayText: 'test1', link: 'test1' },
      { displayText: 'test2', link: 'test2' },
      { displayText: 'test3', link: 'test3' },
      { displayText: 'test4', link: 'test4' },
      { displayText: 'test5', link: 'test5' },
      { displayText: 'test6', link: 'test6' },
      { displayText: 'test7', link: 'test7' },
      { displayText: 'test8', link: 'test8' },
      { displayText: 'test9', link: 'test9' },
      { displayText: 'test10', link: 'test10' }
    ];
  }
}

export interface BreadcumbLinkInterface {
  displayText: String;
  link: String;
}
