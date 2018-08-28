import { Component } from '@angular/core';
import { MessagesViewModel } from './messages.viewmodel';

@Component({
  selector: 'campus-messages-component',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
  constructor(private messagesViewModel: MessagesViewModel) {}

  //TODO add code
}
