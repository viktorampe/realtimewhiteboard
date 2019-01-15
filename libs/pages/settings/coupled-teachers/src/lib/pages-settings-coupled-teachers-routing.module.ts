import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoupledTeachersComponent } from './components/coupled-teachers.component';

const routes: Routes = [
  {
    path: '',
    component: CoupledTeachersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesSettingsCoupledTeachersRoutingModule {}
