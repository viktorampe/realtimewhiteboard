import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DalModule } from '@campus/dal';
import { AuthenticationGuard, TermPrivacyGuard } from '@campus/guards';
import { SharedModule } from '@campus/shared';
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
      environment.features.globalSearch,
      environment.features.favorites,
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
  providers: [AuthenticationGuard, TermPrivacyGuard],
  bootstrap: [AppComponent],
  entryComponents: [EduContentSearchResultComponent]
})
export class AppModule {}
