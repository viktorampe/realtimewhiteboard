import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './components/logout.component';
import { LogoutResolver } from './components/logout.resolver';

const routes: Routes = [
  {
    path: '',
    component: LogoutComponent,
    resolve: { isResolved: LogoutResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [LogoutResolver]
})
export class LogoutRoutingModule {}
