import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DalModule } from '@campus/dal';
import { AuthenticationGuard, TermPrivacyGuard } from '@campus/guards';
import {
  AppNavTreeInterface,
  APP_NAVIGATION_TREE_TOKEN,
  NavItem,
  SharedModule
} from '@campus/shared';
import { UiModule } from '@campus/ui';
import { NxModule } from '@nrwl/nx';
import { configureBufferSize } from 'ngrx-undo';
import { environment } from '../environments/environment';
import { AppEffectsModule } from './app-effects.module';
import { AppRoutingModule } from './app-routing.module';
import { AppStoreModule } from './app-store.module';
import { AppTokenModule } from './app-token.module';
import { AppComponent } from './app.component';
import { EduContentSearchResultComponent } from './components/searchresults/edu-content-search-result.component';

configureBufferSize(150);

const standardSideNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: 'home',
    link: '/home'
  },
  {
    title: 'Methodes',
    icon: 'book',
    link: '/methods'
  },
  {
    title: 'Taken',
    icon: '',
    link: '/tasks'
  },
  {
    title: 'Resultaten',
    icon: '',
    link: '/results'
  },
  {
    title: 'Vrij oefenen',
    icon: '',
    link: '/practice'
  },
  {
    title: 'Differentiëren',
    icon: '',
    link: ''
  },
  {
    title: 'Instellingen',
    icon: 'settings',
    link: '/settings'
  },
  {
    title: 'Oefenen',
    icon: '',
    link: '/oefenen'
  }
];

const standardSettingsNavItems: NavItem[] = [
  {
    title: 'Mijn gegevens',
    icon: 'profile',
    link: '/settings/profile',
    availableForRoles: ['teacher', 'student']
  },
  {
    title: 'Verander profielfoto',
    icon: 'avatar',
    link: '/settings/profile/avatar',
    availableForRoles: ['teacher']
  },
  {
    title: 'Meldingen',
    icon: 'notifications',
    link: '/settings/alerts',
    availableForRoles: ['teacher']
  }
];

const standardProfileMenuNavItems: NavItem[] = [];

const KabasNavTree: AppNavTreeInterface = {
  sideNav: standardSideNavItems,
  settingsNav: standardSettingsNavItems,
  profileMenuNav: standardProfileMenuNavItems
};

@NgModule({
  declarations: [AppComponent, EduContentSearchResultComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UiModule,
    SharedModule.forRoot(
      environment.features.alerts,
      environment.features.messages,
      environment.features.errorManagement,
      environment.iconMapping,
      environment.website,
      environment.logout,
      environment.login,
      environment.termPrivacy,
      environment.api,
      environment.sso,
      environment.searchModes,
      environment.testing
    ),
    NxModule.forRoot(),
    DalModule.forRoot({ apiBaseUrl: environment.api.APIBase }),
    AppTokenModule,
    AppEffectsModule,
    AppStoreModule
  ],
  providers: [
    AuthenticationGuard,
    TermPrivacyGuard,
    { provide: APP_NAVIGATION_TREE_TOKEN, useValue: KabasNavTree }
  ],
  bootstrap: [AppComponent],
  entryComponents: [EduContentSearchResultComponent]
})
export class AppModule {}
