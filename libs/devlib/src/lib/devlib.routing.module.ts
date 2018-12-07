import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EduContentComponent } from './edu-content/edu-content.component';
import { LoginpageComponent } from './loginpage/loginpage.component';

const routes: Routes = [
  {
    path: '',
    component: LoginpageComponent
  },
  {
    path: 'educontent',
    component: EduContentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevlibRoutingModule {}
