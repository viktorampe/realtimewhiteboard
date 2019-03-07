import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EduContentsViewModel } from './components/edu-contents.viewmodel';
import { EduContentsComponent } from './components/edu-contents/edu-contents.component';

const routes: Routes = [
  {
    path: '',
    component: EduContentsComponent,
    resolve: { isResolved: EduContentsViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesEduContentsRoutingModule {}
