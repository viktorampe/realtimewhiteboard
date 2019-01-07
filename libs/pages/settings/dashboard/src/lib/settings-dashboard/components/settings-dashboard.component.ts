import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Link {
  url: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'campus-settings-dashboard',
  templateUrl: './settings-dashboard.component.html',
  styleUrls: ['./settings-dashboard.component.scss']
})
export class SettingsDashboardComponent implements OnInit {
  //TODO replace with viewmodel
  links: Observable<Link[]>;

  constructor() {
    this.links = of([
      { name: 'link1', url: 'test1', icon: 'menu' },
      { name: 'link3', url: 'test3', icon: 'menu' },
      { name: 'link4', url: 'test4', icon: 'menu' },
      { name: 'link5', url: 'test5', icon: 'menu' },
      { name: 'link6', url: 'test6', icon: 'menu' },
      { name: 'link7', url: 'test7', icon: 'menu' },
      { name: 'link8', url: 'test8', icon: 'menu' }
    ]);
  }

  ngOnInit() {}
}
