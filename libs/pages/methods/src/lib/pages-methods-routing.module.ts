import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodChapterLessonComponent } from './components/method-chapter-lesson/method-chapter-lesson.component';
import { MethodChapterComponent } from './components/method-chapter/method-chapter.component';
import { MethodComponent } from './components/method/method.component';
import { MethodsOverviewComponent } from './components/methods-overview/methods-overview.component';
import { MethodBookChapterLessonResolver } from './components/pages-method-book-chapter-lesson.resolver';
import { MethodBookChapterResolver } from './components/pages-method-book-chapter.resolver';
import { MethodBookResolver } from './components/pages-method-book.resolver';
import { MethodOverviewResolver } from './components/pages-method-overview.resolver';
import { MethodResolver } from './components/pages-method.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: MethodResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        resolve: { isResolved: MethodOverviewResolver },
        runGuardsAndResolvers: 'always',
        component: MethodsOverviewComponent
      },
      {
        path: ':book',
        resolve: { isResolved: MethodBookResolver },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            component: MethodComponent
          },
          {
            path: ':chapter',
            resolve: { isResolved: MethodBookChapterResolver },
            runGuardsAndResolvers: 'always',
            children: [
              {
                path: '',
                component: MethodChapterComponent
              },
              {
                path: ':lesson',
                resolve: { isResolved: MethodBookChapterLessonResolver },
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
