import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodChapterLessonComponent } from './components/method-chapter-lesson/method-chapter-lesson.component';
import { MethodChapterComponent } from './components/method-chapter/method-chapter.component';
import { MethodComponent } from './components/method/method.component';
import { MethodsOverviewComponent } from './components/methods-overview/methods-overview.component';
import { MethodsResolver } from './components/pages-methods.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: MethodsResolver },
    runGuardsAndResolvers: 'always',
    component: MethodsOverviewComponent,
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
