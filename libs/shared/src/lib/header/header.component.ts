import { Component, OnInit } from '@angular/core';
import { HeaderViewModel, PageBarNavItem } from './header.viewmodel';

@Component({
  selector: 'campus-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  enableAlerts: boolean;
  enableMessages: boolean;
  breadCrumbs$ = this.headerViewModel.breadCrumbs$;
  pageBarNavItem$ = this.headerViewModel.pageBarNavItem$;

  constructor(public headerViewModel: HeaderViewModel) {}

  ngOnInit(): void {
    this.loadFeatureToggles();
  }

  private loadFeatureToggles() {
    this.enableAlerts = this.headerViewModel.enableAlerts;
    this.enableMessages = this.headerViewModel.enableMessages;
  }

  onPageBarNavigation(navItem: PageBarNavItem) {
    this.headerViewModel.onPageBarNavigation(navItem);
  }
}
