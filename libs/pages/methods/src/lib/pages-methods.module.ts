import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material';
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
import { LearningPlanGoalProgressManagementComponent } from './components/learning-plan-goal-progress-management/learning-plan-goal-progress-management.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    PagesMethodsRoutingModule,
    SearchModule,
    SharedModule,
    UiModule,
    GuardsModule
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
    MethodYearTileComponent,
    LearningPlanGoalProgressManagementComponent
  ],
  exports: []
})
export class PagesMethodsModule {}
