import { TrainingViewModel } from './components/training.viewmodel';
import { TrainingComponent } from './components/training.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TrainingComponent,
    resolve: { isResolved: TrainingViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesTrainingRoutingModule {}
