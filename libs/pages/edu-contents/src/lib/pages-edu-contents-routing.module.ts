import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EduContentsComponent } from './components/edu-contents/edu-contents.component';

const routes: Routes = [
  {
    path: '',
    component: EduContentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesEduContentsRoutingModule {}
