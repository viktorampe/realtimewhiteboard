import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent<T> {
  @Input() message: string;
  @Input() icon: string;
  @Input() actions: BannerAction<T>[];
  @Output() afterDismiss = new EventEmitter<T>();

  constructor() {}

  onAction(action: T) {
    this.onDismiss(action);
  }

  onDismiss(action: T) {
    this.afterDismiss.next(action);
  }
}

export interface BannerAction<T> {
  title: string;
  userAction: T;
}
