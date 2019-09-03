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
      }
    ];

    this.itemColumns = [
      {
        item: new ClassGroupFixture({ id: 1, name: 'Klas 1A' }),
        key: 'id',
        label: 'name'
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
  }
}
