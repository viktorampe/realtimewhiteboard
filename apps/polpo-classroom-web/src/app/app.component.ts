import { Component } from '@angular/core';
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
  public bannerFeedback$ = this.appViewModel.bannerFeedback$;

  /**
   * the link to the promo website, used on the logo
   */
  protected websiteUrl: string = environment.website.url;

  constructor(private appViewModel: AppViewModel) {}

  protected onBannerDismiss(event) {
    this.appViewModel.onBannerDismiss(event);
  }
}
