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
import { EffectsModule } from '@ngrx/effects';
import { NxModule } from '@nrwl/nx';
import { configureBufferSize } from 'ngrx-undo';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppStoreModule } from './app-store.module';
import { AppComponent } from './app.component';
import { EduContentSearchResultComponent } from './components/searchresults/edu-content-search-result.component';
import { EduContentSearchResultItemService } from './components/searchresults/edu-content-search-result.service';
import { EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN } from './components/searchresults/edu-content-search-result.service.interface';
import {
  SearchTermFilterFactory,
  SEARCH_TERM_FILTER_FACTORY_TOKEN
} from './factories/search-term-filter/search-term-filter.factory';
import { FavIconService, FAVICON_SERVICE_TOKEN } from './services/favicons';

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
    EffectsModule.forRoot([]),
    AppRoutingModule,
    AppStoreModule
  ],
  providers: [
    Title,
    {
      provide: FAVICON_SERVICE_TOKEN,
      useClass: FavIconService
    },
    {
      provide: SEARCH_TERM_FILTER_FACTORY_TOKEN,
      useClass: SearchTermFilterFactory
    },
    {
      provide: EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN,
      useClass: EduContentSearchResultItemService
    }
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule],
  entryComponents: [EduContentSearchResultComponent, ManageCollectionComponent]
})
export class AppModule {}
