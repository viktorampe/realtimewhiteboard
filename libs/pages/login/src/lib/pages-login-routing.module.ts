import { LoginViewModel } from './components/login.viewmodel';
import { LoginComponent } from './components/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    resolve: { isResolved: LoginViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesLoginRoutingModule {}
