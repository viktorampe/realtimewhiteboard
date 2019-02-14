import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EduContentComponent } from './edu-content/edu-content.component';
import { FindingNemoComponent } from './finding-nemo/finding-nemo.component';
import { LoginpageComponent } from './loginpage/loginpage.component';

const routes: Routes = [
  {
    path: 'finding-nemo',
    component: FindingNemoComponent,
    data: { breadcrumbText: 'Nemo' }
  },
  {
    path: 'educontent',
    component: EduContentComponent
  },
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
