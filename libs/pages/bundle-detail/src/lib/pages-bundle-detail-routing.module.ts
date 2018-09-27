import { BundleDetailViewModel } from './components/bundle-detail.viewmodel';

import { BundleDetailComponent } from './components/bundle-detail.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: BundleDetailComponent,
    resolve: { isResolved: BundleDetailViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesBundleDetailRoutingModule {}
