import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HomeResolver } from './components/resolvers/pages-home.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: HomeResolver },
    runGuardsAndResolvers: 'always',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesHomeRoutingModule {}
