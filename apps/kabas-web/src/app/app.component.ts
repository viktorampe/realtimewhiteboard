import { Component } from '@angular/core';
import { NavItem } from '@campus/ui';
import { Observable } from 'rxjs';
import { AppViewModel } from './app.viewmodel';

@Component({
  selector: 'campus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // streams
  public navigationItems$: Observable<NavItem[]>;
  public sideNavOpen$: Observable<boolean>;

  constructor(private appViewModel: AppViewModel) {
    this.initialize();
  }

  initialize() {
    this.navigationItems$ = this.appViewModel.navigationItems$;
    this.sideNavOpen$ = this.appViewModel.sideNavOpen$;
  }

  public onNavItemChanged(event) {
    this.appViewModel.onNavItemChanged(event);
  }

  public onSideBarToggle(open: boolean) {
    this.appViewModel.toggleSidebar(open);
  }
}
