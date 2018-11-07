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
  ENVIRONMENT_MESSAGES_FEATURE_TOKEN
} from './interfaces';

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
  ]
})
export class SharedModule {
  static forRoot(
    environmentAlertsFeature: EnvironmentAlertsFeatureInterface,
    environmentMessagesFeature: EnvironmentMessagesFeatureInterface
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
        }
      ]
    };
  }
}
