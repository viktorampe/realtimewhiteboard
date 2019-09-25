import { NgModule } from '@angular/core';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DalModule } from '@campus/dal';
import { GuardsModule } from '@campus/guards';
import { SearchModule } from '@campus/search';
import { SharedModule } from '@campus/shared';
import { ManageCollectionComponent, UiModule } from '@campus/ui';
import { UtilsModule } from '@campus/utils';
import { NxModule } from '@nrwl/nx';
import { configureBufferSize } from 'ngrx-undo';
import { environment } from '../environments/environment';
import { AppEffectsModule } from './app-effects.module';
import { AppRoutingModule } from './app-routing.module';
import { AppStoreModule } from './app-store.module';
import { AppTokenModule } from './app-token.module';
import { AppComponent } from './app.component';
import { EduContentSearchResultComponent } from './components/searchresults/edu-content-search-result.component';

// if you want to update the buffer (which defaults to 100)
configureBufferSize(150);

@NgModule({
  declarations: [AppComponent, EduContentSearchResultComponent],
  imports: [
    SearchModule,
    UiModule,
    UtilsModule,
    MatTooltipModule,
    MatIconModule,
    BrowserModule,
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
    BrowserAnimationsModule,
    NxModule.forRoot(),
    DalModule.forRoot({ apiBaseUrl: environment.api.APIBase }),
    GuardsModule,
    AppRoutingModule,
    AppTokenModule,
    AppEffectsModule,
    AppStoreModule
  ],
  providers: [Title],
  bootstrap: [AppComponent],
  exports: [RouterModule],
  entryComponents: [EduContentSearchResultComponent, ManageCollectionComponent]
})
export class AppModule {}
