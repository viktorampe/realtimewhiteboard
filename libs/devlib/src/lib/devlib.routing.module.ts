import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EduContentComponent } from './edu-content/edu-content.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginPageViewModel } from './loginpage/loginpage.viewmodel';

const routes: Routes = [
  {
    path: '',
    component: LoginpageComponent,
    resolve: { isResolved: LoginPageViewModel }
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
