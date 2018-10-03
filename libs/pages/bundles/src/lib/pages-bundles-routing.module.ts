import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BundleDetailComponent } from './components/bundle-detail/bundle-detail.component';
import { BundlesComponent } from './components/bundles.component';
import { BundlesViewModel } from './components/bundles.viewmodel';

const routes: Routes = [
  {
    path: '',
    component: BundlesComponent,
    resolve: { isResolved: BundlesViewModel },
    children: [{ path: 'bundle-detail', component: BundleDetailComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesBundlesRoutingModule {}
