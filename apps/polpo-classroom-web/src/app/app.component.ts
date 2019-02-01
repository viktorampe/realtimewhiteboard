import { Component } from '@angular/core';
import { EffectFeedbackInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AppViewModel } from './app.viewmodel';

@Component({
  selector: 'campus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'polpo-classroom-web';
  public navItems$ = this.appViewModel.navigationItems$;
  public bannerFeedback$: Observable<EffectFeedbackInterface>;
  sideNavOpen$: Observable<boolean>;

  /**
   * the link to the promo website, used on the logo
   */
  protected websiteUrl: string = environment.website.url;

  constructor(private appViewModel: AppViewModel) {
    this.sideNavOpen$ = appViewModel.sideNavOpen$;
    this.bannerFeedback$ = this.appViewModel.bannerFeedback$;
  }

  protected onSideBarToggle(open: boolean) {
    this.appViewModel.toggleSidebar(open);
  }

  protected onBannerDismiss(event) {
    this.appViewModel.onBannerDismiss(event);
  }
}
