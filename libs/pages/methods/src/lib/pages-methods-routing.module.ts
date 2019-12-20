import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EduContentTocQueries, MethodQueries } from '@campus/dal';
import { AllowedMethodGuard, PermissionGuard } from '@campus/guards';
import { MethodChapterComponent } from './components/method-chapter/method-chapter.component';
import { MethodComponent } from './components/method/method.component';
import { MethodsOverviewComponent } from './components/methods-overview/methods-overview.component';
import { MethodBookChapterLessonResolver } from './resolvers/pages-method-book-chapter-lesson.resolver';
import { MethodBookChapterResolver } from './resolvers/pages-method-book-chapter.resolver';
import { MethodBookResolver } from './resolvers/pages-method-book.resolver';
import { MethodOverviewResolver } from './resolvers/pages-method-overview.resolver';
import { MethodResolver } from './resolvers/pages-method.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: MethodResolver },
    runGuardsAndResolvers: 'always',
    canActivate: [PermissionGuard],
    data: {
      requiredPermissions: 'manageMethods'
    },
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
        canActivate: [AllowedMethodGuard],
        data: {
          selector: MethodQueries.getMethodWithYearByBookId
        },
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
            data: {
              selector: EduContentTocQueries.getById,
              displayProperty: 'title'
            },
            children: [
              {
                path: '',
                component: MethodChapterComponent
              },
              {
                path: ':lesson',
                resolve: { isResolved: MethodBookChapterLessonResolver },
                runGuardsAndResolvers: 'always',
                data: {
                  selector: EduContentTocQueries.getById,
                  displayProperty: 'title'
                },
                component: MethodChapterComponent
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
