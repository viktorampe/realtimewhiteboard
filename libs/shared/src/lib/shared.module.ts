import { LayoutModule } from '@angular/cdk/layout';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { UiModule } from '@campus/ui';
import { PageBarContainerComponent } from './components/page-bar-container/page-bar-container.component';
import { HeaderComponent } from './header/header.component';
import {
  EnvironmentAlertsFeatureInterface,
  EnvironmentMessagesFeatureInterface,
  ENVIRONMENT_ALERTS_FEATURE_TOKEN,
  ENVIRONMENT_MESSAGES_FEATURE_TOKEN,
  ENVIRONMENT_WEBSITE_URL_TOKEN
} from './interfaces';
import { FilterService } from './services/filter.service';
import { FILTER_SERVICE_TOKEN } from './services/filter.service.interface';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    PortalModule,
    LayoutModule,
    MatIconModule,
    RouterModule
  ],
  declarations: [HeaderComponent, PageBarContainerComponent],
  exports: [
    HeaderComponent,
    PortalModule,
    LayoutModule,
    PageBarContainerComponent
  ],
  providers: [{ provide: FILTER_SERVICE_TOKEN, useClass: FilterService }]
})
export class SharedModule {
  static forRoot(
    environmentAlertsFeature: EnvironmentAlertsFeatureInterface,
    environmentMessagesFeature: EnvironmentMessagesFeatureInterface,
    environmentWebsiteUrl: string
  ): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: ENVIRONMENT_ALERTS_FEATURE_TOKEN,
          useValue: environmentAlertsFeature
        },
        {
          provide: ENVIRONMENT_MESSAGES_FEATURE_TOKEN,
          useValue: environmentMessagesFeature
        },
        {
          provide: ENVIRONMENT_WEBSITE_URL_TOKEN,
          useValue: environmentWebsiteUrl
        }
      ]
    };
  }
}
