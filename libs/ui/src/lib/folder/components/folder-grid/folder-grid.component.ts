import { Component, ContentChild } from '@angular/core';
import { BaseFolder, ViewMode } from '../../folder.component';
import { FolderProgressIndicatorComponent } from '../folder-progress-indicator/folder-progress-indicator.component';

@Component({
  selector: 'campus-folder-grid',
  templateUrl: './folder-grid.component.html',
  styleUrls: ['./folder-grid.component.scss']
})
export class FolderGridComponent extends BaseFolder {
  /**
   * Reference to the progress indicator.
   * Used to determine whether the default icon should be visible.
   * @type {ElementRef<HTMLElement>}
   * @memberof FolderComponent
   */
  @ContentChild(FolderProgressIndicatorComponent)
  set progressIndicator(progressIndicator: FolderProgressIndicatorComponent) {
    this._progressIndicator = progressIndicator;
    this.setProgressIndicatorViewMode(ViewMode.GRID);
  }
}
