import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningAreaQueries } from '@campus/dal';
import { EduContentSearchModesComponent } from './components/edu-content-area/edu-contents-search-modes/edu-contents-search-modes.component';
import { EduContentLearningAreaOverviewComponent } from './components/edu-contents-learning-area-overview/edu-contents-learning-area-overview.component';
import { EduContentSearchByTermComponent } from './components/edu-contents-search-by-term/edu-contents-search-by-term.component';
import { EduContentsResolver } from './components/edu-contents.resolver';

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
      },
      {
        path: ':area',
        data: {
          selector: LearningAreaQueries.getById,
          displayProperty: 'name'
        },
        component: EduContentSearchModesComponent,
        children: []
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesEduContentsRoutingModule {}
