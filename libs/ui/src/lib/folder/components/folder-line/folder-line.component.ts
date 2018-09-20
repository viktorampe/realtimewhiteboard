import { Component } from '@angular/core';
import { Folder } from '../../folder';

@Component({
  selector: 'campus-folder-line',
  templateUrl: './folder-line.component.html',
  styleUrls: ['./folder-line.component.scss']
})
export class FolderLineComponent extends Folder {}
