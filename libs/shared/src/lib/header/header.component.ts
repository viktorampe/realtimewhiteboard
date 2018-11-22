import { Component, OnInit } from '@angular/core';
import { HeaderViewModel } from './header.viewmodel';

@Component({
  selector: 'campus-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  enableAlerts: boolean;
  enableMessages: boolean;
  breadCrumbs$ = this.headerViewModel.breadCrumbs$;
  backLink$ = this.headerViewModel.backLink$;

  constructor(private headerViewModel: HeaderViewModel) {}

  ngOnInit(): void {
    this.loadFeatureToggles();
  }

  private loadFeatureToggles() {
    this.enableAlerts = this.headerViewModel.enableAlerts;
    this.enableMessages = this.headerViewModel.enableMessages;
  }

  onMenuClick() {
    this.headerViewModel.toggleSideNav();
  }
}
