import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HeaderResolver } from '../../../../shared/src/lib/header/header.resolver';
import { BundleDetailComponent } from './components/bundle-detail/bundle-detail.component';
import { BundlesResolver } from './components/bundles.resolver';
import { BundlesComponent } from './components/bundles/bundles.component';
import { LearningAreasComponent } from './components/learning-areas/learning-areas.component';

const routes: Routes = [
  {
    path: '',
    component: LearningAreasComponent,
    resolve: { isResolved: BundlesResolver },
    children: [
      {
        path: ':area',
        children: [
          {
            path: '',
            component: BundlesComponent
          },
          {
            path: ':bundle',
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
