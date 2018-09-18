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
 * Places an array of components in a Grid or List layout.
 *
 * @param {object[]} contentArray - The array of objects to show.
 * @param {boolean} isGrid - (true) Show components in a grid or (false) in a list.
 * @param {boolean} multiSelect - Allow selection of multiple components.
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
  @Input() contentArray: object[];
  @Input() isGrid: boolean;
  @Input() multiSelect = false;
  @Input() placeHolderText = 'Er zijn geen beschikbare items.';

  @Output() selectionChanged = new EventEmitter<object[]>();

  selectionArray: object[] = [];

  isSelected(item: object) {
    return this.selectionArray.find(i => i === item) !== undefined;
  }

  //TODO: verwijderen
  toggleGrid(isGrid: boolean) {
    this.isGrid = isGrid;
  }

  itemClicked(item: object) {
    if (this.multiSelect) {
      const foundItems = this.selectionArray.filter(i => i === item);
      if (foundItems.length) {
        this.selectionArray = this.selectionArray.filter(i => i !== item);
      } else {
        this.selectionArray.push(item);
      }
    } else {
      this.selectionArray = [item];
    }

    if (this.selectionChanged) {
      this.selectionChanged.emit(this.selectionArray);
    }
  }
}
