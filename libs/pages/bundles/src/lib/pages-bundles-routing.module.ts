import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        component: BundlesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesBundlesRoutingModule {}
