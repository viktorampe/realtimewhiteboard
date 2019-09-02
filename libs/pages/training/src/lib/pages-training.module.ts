import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { TrainingComponent } from './components/training.component';
import { TrainingViewModel } from './components/training.viewmodel';
import { PagesTrainingRoutingModule } from './pages-training-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesTrainingRoutingModule,
    UiModule,
    PagesSharedModule
  ],
  declarations: [TrainingComponent],
  providers: [TrainingViewModel]
})
export class PagesTrainingModule {}
