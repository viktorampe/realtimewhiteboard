import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule, MatDialogModule } from '@angular/material';
import { GuardsModule } from '@campus/guards';
import { SearchModule } from '@campus/search';
import {
  CONTENT_OPENER_TOKEN,
  CONTENT_TASK_MANAGER_TOKEN,
  SharedModule
} from '@campus/shared';
import { UiModule } from '@campus/ui';
import { MethodChapterComponent } from './components/method-chapter/method-chapter.component';
import { MethodViewModel } from './components/method.viewmodel';
import { MethodComponent } from './components/method/method.component';
import { MethodsOverviewComponent } from './components/methods-overview/methods-overview.component';
import { PagesMethodsRoutingModule } from './pages-methods-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    PagesMethodsRoutingModule,
    SearchModule,
    SharedModule,
    UiModule,
    GuardsModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: CONTENT_OPENER_TOKEN,
      useExisting: MethodViewModel
    },
    {
      provide: CONTENT_TASK_MANAGER_TOKEN,
      useValue: {
        addEduContentToTask: () => {},
        removeEduContentFromTask: () => {}
      }
    }
  ],
  declarations: [
    MethodsOverviewComponent,
    MethodComponent,
    MethodChapterComponent
  ],
  exports: [],
  entryComponents: []
})
export class PagesMethodsModule {}
