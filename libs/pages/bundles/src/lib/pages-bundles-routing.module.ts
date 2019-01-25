import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BundleQueries, LearningAreaQueries } from '@campus/dal';
import { BundleDetailComponent } from './components/bundle-detail/bundle-detail.component';
import { BundlesResolver } from './components/bundles.resolver';
import { BundlesComponent } from './components/bundles/bundles.component';
import { LearningAreasComponent } from './components/learning-areas/learning-areas.component';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: BundlesResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: LearningAreasComponent
      },
      {
        path: ':area',
        data: {
          selector: LearningAreaQueries.getById,
          displayProperty: 'name'
        },
        children: [
          {
            path: '',
            component: BundlesComponent
          },
          {
            path: ':bundle',
            component: BundleDetailComponent,
            data: { selector: BundleQueries.getById, displayProperty: 'name' }
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
