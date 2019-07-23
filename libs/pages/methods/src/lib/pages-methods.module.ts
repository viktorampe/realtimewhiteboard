import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchModule } from '@campus/search';
import {
  ContentActionsService,
  CONTENT_ACTIONS_SERVICE_TOKEN,
  CONTENT_OPENER_TOKEN
} from '@campus/shared';
import { UiModule } from '@campus/ui';
import { MethodChapterLessonComponent } from './components/method-chapter-lesson/method-chapter-lesson.component';
import { MethodChapterComponent } from './components/method-chapter/method-chapter.component';
import { MethodViewModel } from './components/method.viewmodel';
import { MethodComponent } from './components/method/method.component';
import { MethodsOverviewComponent } from './components/methods-overview/methods-overview.component';
import { PagesMethodsRoutingModule } from './pages-methods-routing.module';

@NgModule({
  imports: [CommonModule, PagesMethodsRoutingModule, SearchModule, UiModule],
  providers: [
    {
      provide: CONTENT_OPENER_TOKEN,
      useClass: MethodViewModel
    },
    {
      provide: CONTENT_ACTIONS_SERVICE_TOKEN,
      useClass: ContentActionsService
    }
  ],
  declarations: [
    MethodsOverviewComponent,
    MethodComponent,
    MethodChapterComponent,
    MethodChapterLessonComponent
  ]
})
export class PagesMethodsModule {}
