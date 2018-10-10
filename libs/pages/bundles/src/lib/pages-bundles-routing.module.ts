import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BundlesViewModel } from './components/bundles.viewmodel';
import { LearningAreasComponent } from './components/learning-areas.component';

const routes: Routes = [
  {
    path: '',
    component: LearningAreasComponent,
    resolve: { isResolved: BundlesViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesBundlesRoutingModule {}
