import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BundleDetailComponent } from './components/bundle-detail/bundle-detail.component';
import { BundlesViewModel } from './components/bundles.viewmodel';
import { BundlesComponent } from './components/bundles/bundles.component';
import { LearningAreasComponent } from './components/learning-areas/learning-areas.component';

const routes: Routes = [
  {
    path: '',
    component: LearningAreasComponent,
    resolve: { isResolved: BundlesViewModel }
  },
  {
    path: ':area',
    resolve: { isResolved: BundlesViewModel },
    children: [
      {
        path: '',
        component: BundlesComponent,
        resolve: { isResolved: BundlesViewModel }
      },
      {
        path: ':bundle',
        component: BundleDetailComponent,
        resolve: { isResolved: BundlesViewModel }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesBundlesRoutingModule {}
