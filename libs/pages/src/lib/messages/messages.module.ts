import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessagesComponent } from './components/messages.component';
import { MessagesViewModel } from './components/messages.viewmodel';
import { MessagesRoutingModule } from './messages-routing.module';

@NgModule({
  declarations: [MessagesComponent],
  imports: [CommonModule, MessagesRoutingModule],
  exports: [],
  providers: [MessagesViewModel]
})
export class MessagesModule {}
