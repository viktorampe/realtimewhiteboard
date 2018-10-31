import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EduContentComponent } from './edu-content/edu-content.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoginPageViewModel } from './loginpage/loginpage.viewmodel';
import { UiPageComponent } from './ui-page/ui-page.component';

const routes: Routes = [
  {
    path: '',
    component: LoginpageComponent,
    resolve: { isResolved: LoginPageViewModel }
  },
  {
    path: 'educontent',
    component: EduContentComponent
  },
  {
    path: 'ui',
    component: UiPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevlibRoutingModule {}
