import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodsResolver } from './components/pages-methods.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: MethodsResolver },
    runGuardsAndResolvers: 'always',
    component: MethodOverviewComponent,
    data: { breadcrumbText: 'Methodes' },
    children: [
      {
        path: ':method',
        component: MethodComponent
      },
      {
        path: ':method/:chapter',
        component: MethodChapterComponent
      },
      {
        path: ':method/:chapter/:lesson',
        component: MethodChapterLessonComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesEduContentsRoutingModule {}
