import { MessagesViewModel } from './components/messages.viewmodel';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesMessagesRoutingModule } from './pages-messages-routing.module';
import { MessagesComponent } from './components/messages.component';

@NgModule({
  imports: [CommonModule, PagesMessagesRoutingModule],
  declarations: [MessagesComponent],

  providers: [MessagesViewModel]
})
export class PagesMessagesModule {}
