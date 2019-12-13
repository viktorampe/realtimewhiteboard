import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { LoginResolver } from './resolvers/pages-login.resolver';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    resolve: { isResolved: LoginResolver },
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesLoginRoutingModule {}
