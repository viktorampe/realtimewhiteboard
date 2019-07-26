import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';

const routes: Routes = [
  {
    path: 'settings',
    component: LoginpageComponent
  },
  {
    path: 'login',
    component: LoginpageComponent,
    data: { breadcrumbText: 'Login' }
  },
  {
    path: '',
    component: LoginpageComponent,
    children: [
      {
        path: ':errorCode',
        component: LoginpageComponent,
        data: { breadcrumbText: 'Error' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevlibRoutingModule {}
