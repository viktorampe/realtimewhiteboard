import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BundlesComponent } from './components/bundles.component';
import { BundlesViewModel } from './components/bundles.viewmodel';

@NgModule({
  declarations: [BundlesComponent],
  imports: [CommonModule],
  exports: [],
  providers: [BundlesViewModel]
})
export class BundlesModule {}
