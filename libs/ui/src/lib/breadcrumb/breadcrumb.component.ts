import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() seperator: String = '>';
  @Input() breadCrumbs: BreadcumbLinkInterface[] = [];
  @Input() homeIcon: String = '';
  @Input() hidden: String = '...';
  @Input() maxLen: number;

  constructor() {
    this.breadCrumbs = [
      {
        displayText: 'crumb1',
        href: 'crumb1'
      },
      {
        displayText: 'crumb2',
        href: 'crumb2'
      },
      {
        displayText: 'crumb3',
        href: 'crumb3'
      },
      {
        displayText: 'crumb4',
        href: 'crumb4'
      }
    ];
  }
  ngOnInit() {}
}

export interface BreadcumbLinkInterface {
  displayText: String;
  href: String;
}
