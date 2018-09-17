import { BundlesViewModel } from './components/bundles.viewmodel';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesBundlesRoutingModule } from './pages-bundles-routing.module';
import { BundlesComponent } from './components/bundles.component';
import { UiModule } from '@campus/ui';

@NgModule({
  imports: [CommonModule, PagesBundlesRoutingModule, UiModule],
  declarations: [BundlesComponent],
  exports: [UiModule],

  providers: [BundlesViewModel]
})
export class PagesBundlesModule {}
