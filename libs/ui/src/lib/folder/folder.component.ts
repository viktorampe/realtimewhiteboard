import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { FolderGridComponent } from './components/folder-grid/folder-grid.component';
import { FolderLineComponent } from './components/folder-line/folder-line.component';
import { Folder } from './folder';

@Component({
  selector: 'campus-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent extends Folder implements OnInit {
  folderPortal: ComponentPortal<any>;
  ngOnInit() {
    if (this.lineView) {
      this.folderPortal = new ComponentPortal(FolderLineComponent);
    } else {
      this.folderPortal = new ComponentPortal(FolderGridComponent);
    }
  }
}
