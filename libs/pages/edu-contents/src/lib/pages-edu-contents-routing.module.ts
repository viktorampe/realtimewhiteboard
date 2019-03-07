import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EduContentLearningAreaOverviewComponent } from './components/edu-contents/edu-contents.component';

const routes: Routes = [
  {
    path: '',
    component: EduContentLearningAreaOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesEduContentsRoutingModule {}
