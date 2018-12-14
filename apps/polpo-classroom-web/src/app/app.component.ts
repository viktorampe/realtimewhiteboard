import { Component } from '@angular/core';
import { AuthService } from '@campus/dal';
import { environment } from '../environments/environment';
import { AppViewModel } from './app.viewmodel';

@Component({
  selector: 'campus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'polpo-classroom-web';
  navItems$ = this.appViewModel.navigationItems$;

  /**
   * the link to the promo website, used on the logo
   */
  protected websiteUrl: string = environment.website.url;

  constructor(
    private appViewModel: AppViewModel,
    protected authService: AuthService
  ) {}
}
