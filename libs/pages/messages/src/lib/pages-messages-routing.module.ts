import { MessagesViewModel } from './components/messages.viewmodel';

import { MessagesComponent } from './components/messages.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MessagesComponent,
    resolve: { isResolved: MessagesViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesMessagesRoutingModule {}
