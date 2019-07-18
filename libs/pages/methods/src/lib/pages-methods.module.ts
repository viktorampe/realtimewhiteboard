import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchModule } from '@campus/search';
import { MethodChapterLessonComponent } from './components/method-chapter-lesson/method-chapter-lesson.component';
import { MethodChapterComponent } from './components/method-chapter/method-chapter.component';
import { MethodComponent } from './components/method/method.component';
import { MethodsOverviewComponent } from './components/methods-overview/methods-overview.component';
import { PagesMethodsRoutingModule } from './pages-pages-routing.module';

@NgModule({
  imports: [CommonModule, PagesMethodsRoutingModule, SearchModule],
  declarations: [
    MethodsOverviewComponent,
    MethodComponent,
    MethodChapterComponent,
    MethodChapterLessonComponent
  ]
})
export class PagesMethodsModule {}
