import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { AppViewModel } from './app.viewmodel';

@Component({
  selector: 'campus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'polpo-classroom-web';
  navItems$ = this.appViewModel.navigationItems$;
  bannerFeedback$ = this.appViewModel.bannerFeedback$;
  showBanner = false;
  private subscriptions = new Subscription();

  /**
   * the link to the promo website, used on the logo
   */
  protected websiteUrl: string = environment.website.url;

  constructor(private appViewModel: AppViewModel) {
    this.subscriptions.add(
      this.bannerFeedback$.subscribe(_ => {
        this.showBanner = true;
      })
    );
  }

  protected onBannerDismiss(event) {
    console.log(event);
    this.appViewModel.onBannerDismiss(event);
    this.showBanner = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
