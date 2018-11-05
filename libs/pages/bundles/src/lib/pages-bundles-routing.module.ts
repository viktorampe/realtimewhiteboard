import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BundleDetailComponent } from './components/bundle-detail/bundle-detail.component';
import { BundlesResolver } from './components/bundles.resolver';
import { BundlesComponent } from './components/bundles/bundles.component';
import { LearningAreasComponent } from './components/learning-areas/learning-areas.component';

const routes: Routes = [
  {
    path: '',
    component: LearningAreasComponent,
    resolve: { isResolved: BundlesResolver }
  },
  {
    path: ':area',
    resolve: { isResolved: BundlesResolver },
    children: [
      {
        path: '',
        component: BundlesComponent
      },
      {
        path: ':bundle',
        children: [
          {
            path: '',
            component: BundleDetailComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesBundlesRoutingModule {}
