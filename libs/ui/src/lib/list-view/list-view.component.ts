/*
Component list-view
ontvangt array van objecten, zet in een lijst -> aparte componenten?
multiselect mogelijk - selectie in array bijhouden
moet content ook als grid kunnen weergeven
  -> Input + ngTemplate? -> flexbox efficiënter
clicks opvangen?
  -> waarschijnlijk niet -> verantwoordelijkheid componenten -> die events opvangen
wat tonen bij geen content?

sources:
material design :https://material.angular.io/components/list/overview
github: https://github.com/angular/material2/blob/master/src/lib/list/list.ts
  -> MatListItem nog eens grondiger bekijken
 */

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'campus-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {
  @Input() contentArray: Folder[];
  @Input() isGrid: boolean;
  @Input() totalItems: number;

  @Output() selectionChanged: EventEmitter<Folder[]>;

  selectionArray: Folder[];

  isSelected(item: Folder) {
    return this.selectionArray.find(i => i === item) !== undefined;
  }

  toggleGrid(isGrid: boolean) {
    this.isGrid = isGrid;
  }

  itemClicked(id: number) {
    const foundItem = this.selectionArray.find(i => i.Id === id);
    if (foundItem) {
      this.selectionArray = this.selectionArray.filter(i => i !== foundItem);
    } else {
      const newItem = this.contentArray.find(i => i.Id === id);
      this.selectionArray.push(newItem);
      this.selectionArray.sort((a, b) => {
        return a.Name > b.Name ? 1 : b.Name > a.Name ? -1 : 0;
      });
    }
    this.selectionChanged.emit(this.selectionArray);
  }

  ngOnInit() {
    // Mockdata
    this.contentArray = [
      { Id: 1, Name: 'Folder1' },
      { Id: 2, Name: 'Folder2' },
      { Id: 3, Name: 'Folder3' },
      { Id: 4, Name: 'Folder4' },
      { Id: 5, Name: 'Folder5' },
      { Id: 6, Name: 'Folder6' },
      { Id: 7, Name: 'Folder7' },
      { Id: 8, Name: 'Folder8' }
    ];
    this.totalItems = 8;
    this.selectionArray = [];
    this.isGrid = true;
  }
}

export class Folder {
  Id: number;
  Name: string;
}
