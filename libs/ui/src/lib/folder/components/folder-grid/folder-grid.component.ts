import { Component } from '@angular/core';
import { Folder } from '../../folder';

@Component({
  selector: 'campus-folder-grid',
  templateUrl: './folder-grid.component.html',
  styleUrls: ['./folder-grid.component.scss']
})
export class FolderGridComponent extends Folder {}
