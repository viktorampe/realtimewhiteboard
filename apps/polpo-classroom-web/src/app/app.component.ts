import { AfterViewInit, Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { WINDOW } from '@campus/browser';
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
export class AppComponent implements AfterViewInit {
  public title = 'polpo-classroom-web';
  public navItems$ = this.appViewModel.navigationItems$;
  public bannerFeedback$: Observable<EffectFeedbackInterface>;
  public sideNavOpen$: Observable<boolean>;
  public useShell: boolean;

  /**
   * the link to the promo website, used on the logo
   */
  public websiteUrl: string = environment.website.url;

  constructor(
    private appViewModel: AppViewModel,
    private titleService: Title,
    @Inject(FAVICON_SERVICE_TOKEN)
    private faviconService: FavIconServiceInterface,
    @Inject(WINDOW) window: Window
  ) {
    this.sideNavOpen$ = appViewModel.sideNavOpen$;
    this.titleService.setTitle(environment.website.title);
    this.faviconService.setFavicon(environment.website.favicon, 'image/png');
    this.bannerFeedback$ = this.appViewModel.bannerFeedback$;
    this.useShell = window.location.search.indexOf('useShell=0') === -1;
  }

  ngAfterViewInit() {
    this.appViewModel.toggleSidebarOnNavigation();
  }

  public onSideBarToggle(open: boolean) {
    this.appViewModel.toggleSidebar(open);
  }

  public onBannerDismiss(event) {
    this.appViewModel.onFeedbackDismiss(event);
  }

  public onNavItemChanged(event) {
    this.appViewModel.onNavItemChanged(event);
  }
}
