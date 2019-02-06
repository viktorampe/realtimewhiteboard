import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AppViewModel } from './app.viewmodel';
import { BrowserFaviconToken, FaviconsInterface } from './services/favicons';

@Component({
  selector: 'campus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sideNavOpen$: Observable<boolean>;

  navItems$ = this.appViewModel.navigationItems$;

  /**
   * the link to the promo website, used on the logo
   */
  protected websiteUrl: string = environment.website.url;

  constructor(
    private appViewModel: AppViewModel,
    private titleService: Title,
    @Inject(BrowserFaviconToken) private faviconService: FaviconsInterface
  ) {
    this.sideNavOpen$ = appViewModel.sideNavOpen$;
    this.titleService.setTitle(environment.website.title);
    this.faviconService.setFavicon(environment.website.favicon, 'image/png');
  }

  protected onSideBarToggle(open: boolean) {
    this.appViewModel.toggleSidebar(open);
  }
}
