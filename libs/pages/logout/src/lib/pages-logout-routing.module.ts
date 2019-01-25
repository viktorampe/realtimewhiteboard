import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './components/logout.component';
import { LogoutViewModel } from './components/logout.viewmodel';

const routes: Routes = [
  {
    path: '',
    component: LogoutComponent,
    resolve: { isResolved: LogoutViewModel },
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesLogoutRoutingModule {}
