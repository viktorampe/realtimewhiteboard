/*
Component list-view
multiselect mogelijk - selectie in array bijhouden
wat tonen bij geen content?

sources:
material design :https://material.angular.io/components/list/overview
github: https://github.com/angular/material2/blob/master/src/lib/list/list.ts
 */

import { Component, Input, EventEmitter, Output } from '@angular/core';

/**
 * Places an array of Folders in a Grid or List layout.
 *
 * @param {Folder[]} contentArray - The array of folders to show.
 * @param {boolean} isGrid - (true) Show folders in a grid or (false) in a list.
 * @param {number} totalItems - The total amount of unfiltered items.
 * @param {boolean} multiSelect - Allow selection of multiple folders.
 * @param {string} placeHolderText - Text to display when the contentArray is empty.
 *
 * @export
 * @class ListViewComponent
 */
@Component({
  selector: 'campus-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {
  @Input() contentArray: Folder[];
  @Input() isGrid: boolean;
  @Input() totalItems: number;
  @Input() multiSelect = false;
  @Input() placeHolderText = 'Er zijn geen beschikbare items.';

  @Output() selectionChanged = new EventEmitter<Folder[]>();

  selectionArray: Folder[] = [];

  isSelected(item: Folder) {
    return this.selectionArray.find(i => i === item) !== undefined;
  }

  //TODO: verwijderen
  toggleGrid(isGrid: boolean) {
    this.isGrid = isGrid;
  }

  itemClicked(item: Folder) {
    if (this.multiSelect) {
      const foundItems = this.selectionArray.filter(i => i === item);
      if (foundItems.length) {
        this.selectionArray = this.selectionArray.filter(i => i !== item);
      } else {
        this.selectionArray.push(item);
        this.selectionArray.sort((a, b) => {
          return a.Name > b.Name ? 1 : b.Name > a.Name ? -1 : 0;
        });
      }
    } else {
      this.selectionArray = [item];
    }

    if (this.selectionChanged) {
      this.selectionChanged.emit(this.selectionArray);
    }
  }
}

export class Folder {
  Id: number;
  Name: string;
}
