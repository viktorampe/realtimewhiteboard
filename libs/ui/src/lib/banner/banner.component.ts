import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  @Input() message: string;
  @Input() icon: string;
  @Input() actions: BannerAction[];
  @Output() afterDismiss = new EventEmitter<void>();

  constructor() {}

  onAction(action: string) {
    this.onDismiss();
  }

  onDismiss() {
    this.afterDismiss.next();
  }
}

interface BannerAction {
  title: string;
  userAction: string;
}
