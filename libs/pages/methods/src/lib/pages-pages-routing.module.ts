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
    component: MethodsOverviewComponent
  },
  {
    path: ':toc',
    resolve: { isResolved: MethodsResolver },
    runGuardsAndResolvers: 'always',
    component: MethodComponent
  },
  {
    path: ':toc/:chapter',
    resolve: { isResolved: MethodsResolver },
    runGuardsAndResolvers: 'always',
    component: MethodChapterComponent
  },
  {
    path: ':toc/:chapter/:lesson',
    resolve: { isResolved: MethodsResolver },
    runGuardsAndResolvers: 'always',
    component: MethodChapterLessonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesMethodsRoutingModule {}
