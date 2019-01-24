import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Action } from '@ngrx/store';

@Component({
  selector: 'campus-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  @Input() message: string;
  @Input() icon: string;
  @Input() actions: BannerAction[];
  @Output() afterDismiss = new EventEmitter<Action>();

  constructor() {}

  onAction(action: BannerAction) {
    this.onDismiss(action);
  }

  onDismiss(bannerAction: BannerAction) {
    this.afterDismiss.next(bannerAction.userAction);
  }
}

export interface BannerAction {
  title: string;
  userAction: Action;
}
