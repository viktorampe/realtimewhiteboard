import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningAreaQueries } from '@campus/dal';
import { EduContentLearningAreaOverviewComponent } from './components/edu-contents-learning-area-overview/edu-contents-learning-area-overview.component';
import { EduContentSearchByColumnComponent } from './components/edu-contents-search-by-column/edu-contents-search-by-column.component';
import { EduContentSearchByTermComponent } from './components/edu-contents-search-by-term/edu-contents-search-by-term.component';
import { EduContentSearchModesComponent } from './components/edu-contents-search-modes/edu-contents-search-modes.component';
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
        component: EduContentSearchByTermComponent,
        data: { breadcrumbText: 'Standaard zoeken' }
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
            component: EduContentSearchModesComponent
          },
          {
            path: 'term',
            component: EduContentSearchByTermComponent,
            data: { breadcrumbText: 'Standaard zoeken' }
          },
          {
            path: 'plan',
            component: EduContentSearchByColumnComponent,
            data: { breadcrumbText: 'Zoeken op leerplan' }
          },
          {
            path: 'toc',
            component: EduContentSearchByColumnComponent,
            data: { breadcrumbText: 'Zoeken op inhoudstafel' }
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
export class PagesEduContentsRoutingModule {}
