import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../../../../ui/src/lib/tree-nav/tree-nav.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  constructor() {}

  nav: Observable<NavItem[]>;

  ngOnInit() {
    this.nav = new BehaviorSubject([
      {
        title: 'string',
        icon: 'string',
        link: 'string'
      },
      {
        title: 'string',
        icon: 'string',
        children: [
          {
            title: 'string',
            icon: 'string',
            link: 'string'
          },
          {
            title: 'string',
            icon: 'string',
            link: 'string',
            children: [
              {
                title: 'string',
                icon: 'string',
                link: 'string'
              }
            ]
          },
          {
            title: 'string',
            icon: 'string',
            link: 'string'
          }
        ]
      }
    ]);
  }
}
