import { Component, OnInit } from '@angular/core';
import {
  ClassGroupFixture,
  ClassGroupInterface,
  EduContentTOCFixture,
  EduContentTOCInterface
} from '@campus/dal';
import {
  MultiCheckBoxTableColumnChangeEventInterface,
  MultiCheckBoxTableItemChangeEventInterface,
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface
} from '@campus/ui';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { SectionModeEnum } from 'libs/ui/src/lib/section/section.component';

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

  sectionMode = SectionModeEnum.EDITABLE;
  sectionModes = SectionModeEnum;
  editableText = 'I am editable';

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
        isAllSelected: true
      },
      {
        item: new ClassGroupFixture({ id: 2, name: 'Klas 1B' }),
        key: 'id',
        label: 'name'
      }
    ];
  }

  log(data: MultiCheckBoxTableColumnChangeEventInterface<ClassGroupInterface>) {
    console.log(data);

    this.itemColumns.forEach(columnData => {
      if (columnData.item.id === data.column.id) {
        columnData.isAllSelected = data.isChecked;
      }
    });
    this.itemColumns = [...this.itemColumns];
  }

  clickCheckBox(
    data: MultiCheckBoxTableItemChangeEventInterface<
      EduContentTOCInterface,
      ClassGroupInterface,
      any
    >
  ) {
    console.log(data);
  }

  changeMode(mode: SectionModeEnum) {
    this.sectionMode = mode;
  }

  handleIconAction(event: MouseEvent, action: string) {
    event.stopPropagation();
    console.log(
      action + ' clicked: this event should not trigger a section click'
    );
    if (this.sectionMode === SectionModeEnum.EDITING) {
      this.sectionMode = SectionModeEnum.EDITABLE;
    } else {
      this.sectionMode = SectionModeEnum.EDITING;
    }
  }

  handleSectionAction(action: string) {
    console.log(action + ' clicked');
    // this.sectionMode = SectionModeEnum.EDITING;
  }

  save(event: MouseEvent, input: HTMLInputElement) {
    event.stopPropagation();
    console.log(
      'projected button clicked: this event should not trigger a section click'
    );

    this.editableText = input.value;
    this.sectionMode = SectionModeEnum.EDITABLE;
  }
}
