import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BundlesRoutingModule } from './bundles-routing.module';
import { BundlesComponent } from './components/bundles.component';
import { BundlesViewModel } from './components/bundles.viewmodel';

@NgModule({
  declarations: [BundlesComponent],
  imports: [CommonModule, BundlesRoutingModule],
  exports: [],
  providers: [BundlesViewModel]
})
export class BundlesModule {}
