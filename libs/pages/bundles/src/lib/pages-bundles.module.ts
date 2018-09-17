import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { BundlesComponent } from './components/bundles.component';
import { BundlesViewModel } from './components/bundles.viewmodel';
import { PagesBundlesRoutingModule } from './pages-bundles-routing.module';


@NgModule({
  imports: [
    CommonModule,
    PagesBundlesRoutingModule,
    UiModule,
    PagesSharedModule
  ],
  declarations: [BundlesComponent],

  providers: [BundlesViewModel]
})
export class PagesBundlesModule { }
