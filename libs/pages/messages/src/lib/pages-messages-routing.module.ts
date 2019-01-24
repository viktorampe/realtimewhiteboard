import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './components/messages.component';
import { MessagesViewModel } from './components/messages.viewmodel';

const routes: Routes = [
  {
    path: '',
    component: MessagesComponent,
    resolve: { isResolved: MessagesViewModel },
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesMessagesRoutingModule {}
