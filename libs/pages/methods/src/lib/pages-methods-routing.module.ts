import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodChapterLessonComponent } from './components/method-chapter-lesson/method-chapter-lesson.component';
import { MethodChapterComponent } from './components/method-chapter/method-chapter.component';
import { MethodComponent } from './components/method/method.component';
import { MethodsOverviewComponent } from './components/methods-overview/methods-overview.component';
import { MethodChapterLessonResolver } from './components/pages-method-chapter-lesson.resolver';
import { MethodChapterResolver } from './components/pages-method-chapter.resolver';
import { MethodsOverviewResolver } from './components/pages-method-overview.resolver';
import { MethodsResolver } from './components/pages-methods.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: MethodsOverviewResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: MethodsOverviewComponent
      },
      {
        path: ':book',
        resolve: { isResolved: MethodsResolver },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            component: MethodComponent
          },
          {
            path: ':chapter',
            resolve: { isResolved: MethodChapterResolver },
            runGuardsAndResolvers: 'always',
            children: [
              {
                path: '',
                component: MethodChapterComponent
              },
              {
                path: ':lesson',
                resolve: { isResolved: MethodChapterLessonResolver },
                runGuardsAndResolvers: 'always',
                component: MethodChapterLessonComponent
              }
            ]
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
export class PagesMethodsRoutingModule {}
