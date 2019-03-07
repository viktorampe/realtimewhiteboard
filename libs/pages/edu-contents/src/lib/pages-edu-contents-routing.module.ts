import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EduContentSearchByTermComponent } from './components/edu-contents-search-by-term/edu-contents-search-by-term.component';
import { EduContentsResolver } from './components/edu-contents.resolver';
import { EduContentLearningAreaOverviewComponent } from './components/edu-contents/edu-contents.component';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: EduContentsResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: EduContentLearningAreaOverviewComponent
      },
      {
        path: 'term',
        component: EduContentSearchByTermComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesEduContentsRoutingModule {}
