import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getRouterStateParams } from '@campus/dal';
import { ErrorComponent } from './error.component';

const routes: Routes = [
  {
    path: ':code',
    component: ErrorComponent,
    data: {
      selector: getRouterStateParams,
      displayProperty: 'code'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesErrorRoutingModule {}
