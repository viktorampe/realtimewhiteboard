import { LayoutModule } from '@angular/cdk/layout';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Inject, ModuleWithProviders, NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { UiModule } from '@campus/ui';
import { PageBarContainerComponent } from './components/page-bar-container/page-bar-container.component';
import { HeaderComponent } from './header/header.component';
import {
  EnvironmentAlertsFeatureInterface,
  EnvironmentErrorManagementFeatureInterface,
  EnvironmentMessagesFeatureInterface,
  ENVIRONMENT_ALERTS_FEATURE_TOKEN,
  ENVIRONMENT_ERROR_MANAGEMENT_FEATURE_TOKEN,
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_MESSAGES_FEATURE_TOKEN
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
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(ENVIRONMENT_ICON_MAPPING_TOKEN)
    private iconMapping: { [icon: string]: string }
  ) {
    this.setupIconRegistry();
  }
  static forRoot(
    environmentAlertsFeature: EnvironmentAlertsFeatureInterface,
    environmentMessagesFeature: EnvironmentMessagesFeatureInterface,
    environmentErrorManagementFeature: EnvironmentErrorManagementFeatureInterface,
    iconMapping: { [key: string]: string }
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
          provide: ENVIRONMENT_ERROR_MANAGEMENT_FEATURE_TOKEN,
          useValue: environmentErrorManagementFeature
        },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: iconMapping
        }
      ]
    };
  }

  setupIconRegistry() {
    for (const key in this.iconMapping) {
      if (key.indexOf(':') > 0) {
        this.iconRegistry.addSvgIconInNamespace(
          key.split(':')[0],
          key.split(':')[1],
          this.sanitizer.bypassSecurityTrustResourceUrl(this.iconMapping[key])
        );
      } else {
        this.iconRegistry.addSvgIcon(
          key,
          this.sanitizer.bypassSecurityTrustResourceUrl(this.iconMapping[key])
        );
      }
    }
  }
}
