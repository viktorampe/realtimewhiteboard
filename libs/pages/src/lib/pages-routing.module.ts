import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/budles', pathMatch: 'full' },
  { path: 'bundles', loadChildren: './bundles/bundles.module#TrainingModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false, useHash: false })
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
