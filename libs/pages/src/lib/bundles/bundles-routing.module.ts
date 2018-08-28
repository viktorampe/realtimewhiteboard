import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BundlesComponent } from './components/bundles.component';
import { BundlesResolver } from './components/bundles.resolver';

const routes: Routes = [
  {
    path: '',
    component: BundlesComponent,
    resolve: { isResolved: BundlesResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [BundlesResolver]
})
export class BundlesModule {}
