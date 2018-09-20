import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ComponentRef, OnInit } from '@angular/core';
import { FolderGridComponent } from './components/folder-grid/folder-grid.component';
import { FolderLineComponent } from './components/folder-line/folder-line.component';
import { Folder } from './folder';

@Component({
  selector: 'campus-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent extends Folder implements OnInit {
  folderPortal: ComponentPortal<Folder>;
  ngOnInit() {
    if (this.lineView) {
      this.folderPortal = new ComponentPortal(FolderLineComponent);
    } else {
      this.folderPortal = new ComponentPortal(FolderGridComponent);
    }
  }

  configureFolderRef(portalRef: ComponentRef<Folder>) {
    portalRef.instance.backgroundColor = this.backgroundColor;
    portalRef.instance.errorOnEmpty = this.errorOnEmpty;
    portalRef.instance.gradientId = this.gradientId;
    portalRef.instance.gradientUrl = this.gradientUrl;
    portalRef.instance.icon = this.icon;
    portalRef.instance.itemCount = this.itemCount;
    portalRef.instance.lineView = this.lineView;
    portalRef.instance.showDefaultIcon = this.showDefaultIcon;
    portalRef.instance.showEmptyError = this.showEmptyError;
    portalRef.instance.title = this.title;
  }
}
