import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MessagesViewModel } from './messages.viewmodel';

@Injectable()
export class MessagesResolver implements Resolve<boolean> {
  constructor(private messagesViewModel: MessagesViewModel) {}

  resolve(): Observable<boolean> {
    return this.messagesViewModel.initialize().pipe(take(1));
  }
}
