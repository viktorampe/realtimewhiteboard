import { AfterContentInit, Component, ContentChild } from '@angular/core';
import { BaseFolder } from '../../folder.component';
import { FolderProgressIndicatorComponent } from '../folder-progress-indicator/folder-progress-indicator.component';

@Component({
  selector: 'campus-folder-grid',
  templateUrl: './folder-grid.component.html',
  styleUrls: ['./folder-grid.component.scss']
})
export class FolderGridComponent extends BaseFolder
  implements AfterContentInit {
  /**
   * Reference to the progress indicator.
   * Used to determine whether the default icon should be visible.
   * @type {ElementRef<HTMLElement>}
   * @memberof FolderComponent
   */
  @ContentChild(FolderProgressIndicatorComponent)
  progressIndicator: FolderProgressIndicatorComponent;

  constructor() {
    super();
  }
  ngAfterContentInit() {
    if (this.progressIndicator) this.progressIndicator.lineView = false;
    this.setIcon(this.progressIndicator);
  }
}
