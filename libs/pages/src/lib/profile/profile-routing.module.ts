import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile.component';
import { ProfileResolver } from './components/profile.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    resolve: { isResolved: ProfileResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ProfileResolver]
})
export class ProfileRoutingModule {}
