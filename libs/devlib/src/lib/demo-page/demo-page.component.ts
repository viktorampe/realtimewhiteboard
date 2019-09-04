import { Component, OnInit } from '@angular/core';
import {
  ClassGroupFixture,
  ClassGroupInterface,
  EduContentTOCFixture,
  EduContentTOCInterface
} from '@campus/dal';
import {
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface
} from '@campus/ui';

@Component({
  selector: 'campus-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent implements OnInit {
  rowHeaderColumns: MultiCheckBoxTableRowHeaderColumnInterface<
    EduContentTOCInterface
  >[]; // chapters
  items: MultiCheckBoxTableItemInterface<EduContentTOCInterface>[];
  itemColumns: MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[];

  constructor() {}

  ngOnInit() {
    this.rowHeaderColumns = [{ caption: 'Hoofdstuk', key: 'title' }];
    this.items = [
      {
        header: new EduContentTOCFixture({ id: 1, title: 'Hoofdstuk 1' }),
        content: { 1: false, 2: true }
      },
      {
        header: new EduContentTOCFixture({ id: 2, title: 'Hoofdstuk 2' }),
        content: { 1: false, 2: false }
      },
      {
        header: new EduContentTOCFixture({ id: 3, title: 'Hoofdstuk 3' }),
        content: { 1: false, 2: false }
      }
    ];

    this.itemColumns = [
      {
        item: new ClassGroupFixture({ id: 1, name: 'Klas 1A' }),
        key: 'id',
        label: 'name',
        isTopLevelSelected: true
      },
      {
        item: new ClassGroupFixture({ id: 2, name: 'Klas 1B' }),
        key: 'id',
        label: 'name'
      }
    ];
  }

  log(data) {
    console.log(data);

    this.itemColumns.forEach(columnData => {
      if (columnData.item.id === data.itemColumn.id) {
        columnData.isTopLevelSelected = data.isSelected;
      }
    });
    this.itemColumns = [...this.itemColumns];
  }
}
