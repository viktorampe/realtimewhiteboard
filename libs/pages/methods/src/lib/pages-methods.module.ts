import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule, MatDialogModule } from '@angular/material';
import { GuardsModule } from '@campus/guards';
import { SearchModule } from '@campus/search';
import { CONTENT_OPENER_TOKEN, SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { MethodChapterComponent } from './components/method-chapter/method-chapter.component';
import { MethodYearTileComponent } from './components/method-year-tile/method-year-tile.component';
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
      useClass: MethodViewModel
    }
  ],
  declarations: [
    MethodsOverviewComponent,
    MethodComponent,
    MethodChapterComponent,
    MethodYearTileComponent
  ],
  exports: [],
  entryComponents: []
})
export class PagesMethodsModule {}
