import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { BundlesComponent } from './components/bundles.component';
import { BundlesViewModel } from './components/bundles.viewmodel';
import { InfoPanelBundleComponent } from './components/info-panel/info-panel-bundle/info-panel-bundle.component';
import { InfoPanelEducontentComponent } from './components/info-panel/info-panel-educontent/info-panel-educontent.component';
import { InfoPanelEducontentsComponent } from './components/info-panel/info-panel-educontents/info-panel-educontents.component';
import { PagesBundlesRoutingModule } from './pages-bundles-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesBundlesRoutingModule,
    UiModule,
    PagesSharedModule
  ],
  declarations: [
    BundlesComponent,
    InfoPanelBundleComponent,
    InfoPanelEducontentComponent,
    InfoPanelEducontentsComponent
  ],

  providers: [BundlesViewModel]
})
export class PagesBundlesModule {}
