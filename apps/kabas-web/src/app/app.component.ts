import { Component } from '@angular/core';
import { EffectFeedbackInterface } from '@campus/dal';
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
  public sideNavItems$: Observable<NavItem[]>;
  public sideNavOpen$: Observable<boolean>;
  public bannerFeedback$: Observable<EffectFeedbackInterface>;

  constructor(private appViewModel: AppViewModel) {
    this.initialize();
  }

  initialize() {
    this.sideNavItems$ = this.appViewModel.sideNavItems$;
    this.sideNavOpen$ = this.appViewModel.sideNavOpen$;
    this.bannerFeedback$ = this.appViewModel.bannerFeedback$;
  }

  public onNavItemChanged(event) {
    this.appViewModel.onNavItemChanged(event);
  }

  public onSideBarToggle(open: boolean) {
    this.appViewModel.toggleSidebar(open);
  }

  public onBannerDismiss(event) {
    this.appViewModel.onFeedbackDismiss(event);
  }
}
