import { HomeViewModel } from './components/home.viewmodel';
import { HomeComponent } from './components/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { isResolved: HomeViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesHomeRoutingModule {}
