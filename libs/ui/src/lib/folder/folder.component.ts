import { Input, OnInit } from '@angular/core';
import { FolderProgressIndicatorComponent } from './components/folder-progress-indicator/folder-progress-indicator.component';

export class BaseFolder implements OnInit {
  @Input() title: string;
  @Input() icon: string;
  @Input() itemCount: string;
  @Input() backgroundColor: string;
  /**
   * Whether to show an exclamation mark when folder is empty (itemCount is zero).
   *
   * @memberof FolderComponent
   */
  @Input()
  set errorOnEmpty(value) {
    if (value) {
      if (
        isNaN(parseInt(this.itemCount, 10)) ||
        parseInt(this.itemCount, 10) === 0
      ) {
        this.showEmptyError = true;
      }
    }
  }

  gradientId: string;
  gradientUrl: string;
  showDefaultIcon = false;
  showEmptyError: boolean;

  constructor() {}
  ngOnInit() {
    this.gradientId = this.backgroundColor.replace('#', '');
    this.gradientUrl = `url(#MyGradient${this.gradientId})`;
  }

  setIcon(progressIndicator: FolderProgressIndicatorComponent) {
    this.showDefaultIcon = !progressIndicator;
  }
}
