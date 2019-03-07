import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EduContentsResolver } from './components/edu-contents.resolver';
import { EduContentLearningAreaOverviewComponent } from './components/edu-contents/edu-contents.component';

const routes: Routes = [
  {
    path: '',
    component: EduContentLearningAreaOverviewComponent,
    resolve: { isResolved: EduContentsResolver },
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesEduContentsRoutingModule {}
