import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@campus/ui';
import { MethodChapterLessonComponent } from './components/method-chapter-lesson/method-chapter-lesson.component';
import { MethodChapterComponent } from './components/method-chapter/method-chapter.component';
import { MethodYearTileComponent } from './components/method-year-tile/method-year-tile.component';
import { MethodComponent } from './components/method/method.component';
import { MethodsOverviewComponent } from './components/methods-overview/methods-overview.component';
import { PagesMethodsRoutingModule } from './pages-pages-routing.module';

@NgModule({
  imports: [CommonModule, UiModule, PagesMethodsRoutingModule],
  declarations: [
    MethodsOverviewComponent,
    MethodComponent,
    MethodChapterComponent,
    MethodChapterLessonComponent,
    MethodYearTileComponent
  ],
  exports: []
})
export class PagesMethodsModule {}
