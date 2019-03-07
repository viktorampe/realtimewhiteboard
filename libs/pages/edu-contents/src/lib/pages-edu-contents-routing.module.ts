import { EduContentsViewModel } from './components/edu-contents.viewmodel';
import { EduContentsComponent } from './components/edu-contents.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
