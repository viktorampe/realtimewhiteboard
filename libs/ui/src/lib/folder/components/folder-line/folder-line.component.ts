import { Component } from '@angular/core';
import { BaseFolder } from '../../folder.component';

@Component({
  selector: 'campus-folder-line',
  templateUrl: './folder-line.component.html',
  styleUrls: ['./folder-line.component.scss']
})
export class FolderLineComponent extends BaseFolder {
  lineView = true;

  setIcon() {
    this.showDefaultIcon = !this.progressIndicator;
  }
}
