import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EffectFeedbackInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AppViewModel } from './app.viewmodel';
import {
  FavIconServiceInterface,
  FAVICON_SERVICE_TOKEN
} from './services/favicons';

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

  constructor(
    private appViewModel: AppViewModel,
    private titleService: Title,
    @Inject(FAVICON_SERVICE_TOKEN)
    private faviconService: FavIconServiceInterface
  ) {
    this.sideNavOpen$ = appViewModel.sideNavOpen$;
    this.titleService.setTitle(environment.website.title);
    this.faviconService.setFavicon(environment.website.favicon, 'image/png');
    this.bannerFeedback$ = this.appViewModel.bannerFeedback$;
  }

  protected onSideBarToggle(open: boolean) {
    this.appViewModel.toggleSidebar(open);
  }

  protected onBannerDismiss(event) {
    this.appViewModel.onFeedbackDismiss(event);
  }
}
