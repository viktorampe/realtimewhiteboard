import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './components/messages.component';
import { MessagesResolver } from './components/messages.resolver';

const routes: Routes = [
  {
    path: '',
    component: MessagesComponent,
    resolve: { isResolved: MessagesResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MessagesResolver]
})
export class MessagesRoutingModule {}
