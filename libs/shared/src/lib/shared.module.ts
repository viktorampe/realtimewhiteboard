import { LayoutModule } from '@angular/cdk/layout';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { UiModule } from '@campus/ui';
import { PageBarContainerComponent } from './components/page-bar-container/page-bar-container.component';
import { HeaderComponent } from './header/header.component';
import {
  EnvironmentFeaturesInterface,
  ENVIRONMENT_FEATURES_TOKEN
} from './interfaces';
import { HumanDateTimePipe } from './pipes/human-date-time/human-date-time.pipe';
@NgModule({
  imports: [CommonModule, UiModule, PortalModule, LayoutModule],
  declarations: [HeaderComponent, PageBarContainerComponent, HumanDateTimePipe],
  exports: [
    HeaderComponent,
    PortalModule,
    LayoutModule,
    PageBarContainerComponent,
    HumanDateTimePipe
  ]
})
export class SharedModule {
  static forRoot(
    environmentFeatures: EnvironmentFeaturesInterface
  ): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        { provide: ENVIRONMENT_FEATURES_TOKEN, useValue: environmentFeatures }
      ]
    };
  }
}
