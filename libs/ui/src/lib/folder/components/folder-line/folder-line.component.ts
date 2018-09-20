import { AfterContentInit, Component, ContentChild } from '@angular/core';
import { Folder } from '../../folder';
import { FolderProgressIndicatorComponent } from '../folder-progress-indicator/folder-progress-indicator.component';

@Component({
  selector: 'campus-folder-line',
  templateUrl: './folder-line.component.html',
  styleUrls: ['./folder-line.component.scss']
})
export class FolderLineComponent extends Folder implements AfterContentInit {
  @ContentChild(FolderProgressIndicatorComponent)
  progressIndicator: FolderProgressIndicatorComponent;

  ngAfterContentInit() {
    console.log(this.progressIndicator);
  }
}
