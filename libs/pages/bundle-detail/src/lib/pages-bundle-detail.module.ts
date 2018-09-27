import { BundleDetailViewModel } from './components/bundle-detail.viewmodel';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesBundleDetailRoutingModule } from './pages-bundle-detail-routing.module';
import { BundleDetailComponent } from './components/bundle-detail.component';

@NgModule({
  imports: [CommonModule, PagesBundleDetailRoutingModule],
  declarations: [BundleDetailComponent],

  providers: [BundleDetailViewModel]
})
export class PagesBundleDetailModule {}
