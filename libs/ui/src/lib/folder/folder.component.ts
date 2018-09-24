import { AfterContentInit, Input, OnInit } from '@angular/core';
import { FolderProgressIndicatorComponent } from './components/folder-progress-indicator/folder-progress-indicator.component';

export enum ViewMode {
  GRID = 'grid',
  LINE = 'line'
}

export class BaseFolder implements OnInit, AfterContentInit {
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

  protected _progressIndicator: FolderProgressIndicatorComponent;

  gradientId: string;
  gradientUrl: string;
  showDefaultIcon = false;
  showEmptyError: boolean;

  constructor() {}

  ngOnInit() {
    this.gradientId = this.backgroundColor.replace('#', '');
    this.gradientUrl = `url(#MyGradient${this.gradientId})`;
  }

  ngAfterContentInit() {
    this.setIcon();
  }

  /**
   * Shows a default icon when the progress indicator is absent.
   *
   * @protected
   * @memberof BaseFolder
   */
  protected setIcon() {
    this.showDefaultIcon = !this._progressIndicator;
  }

  /**
   * Sets the view mode of the progress indicator.
   *
   * @protected
   * @param {ViewMode} viewMode
   * @memberof BaseFolder
   */
  protected setProgressIndicatorViewMode(viewMode: ViewMode) {
    if (this._progressIndicator) this._progressIndicator.viewMode = viewMode;
  }
}
