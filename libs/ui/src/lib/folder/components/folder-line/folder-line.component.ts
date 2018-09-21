import { AfterContentInit, Component, ContentChild } from '@angular/core';
import { BaseFolder } from '../../folder.component';
import { FolderProgressIndicatorComponent } from '../folder-progress-indicator/folder-progress-indicator.component';

@Component({
  selector: 'campus-folder-line',
  templateUrl: './folder-line.component.html',
  styleUrls: ['./folder-line.component.scss']
})
export class FolderLineComponent extends BaseFolder
  implements AfterContentInit {
  /**
   * Reference to the progress indicator.
   * Used to determine whether the default icon should be visible.
   * @type {ElementRef<HTMLElement>}
   * @memberof FolderComponent
   */
  @ContentChild(FolderProgressIndicatorComponent)
  progressIndicator: FolderProgressIndicatorComponent;

  ngAfterContentInit() {
    this.setIcon(this.progressIndicator);
    if (this.progressIndicator) this.progressIndicator.lineView = true;
  }
}
