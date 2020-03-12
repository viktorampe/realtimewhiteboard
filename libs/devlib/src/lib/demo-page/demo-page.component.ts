import { Component, OnInit } from '@angular/core';
import { ClassGroupInterface, EduContentTOCInterface } from '@campus/dal';
import {
  MultiCheckBoxTableColumnChangeEventInterface,
  MultiCheckBoxTableItemChangeEventInterface,
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface,
  SectionModeEnum
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

  sectionMode = SectionModeEnum.EDITABLE;
  sectionModes = SectionModeEnum;
  editableText = 'I am editable';
  staticText = 'I am static content';

  backHeaderTitle = 'Lesmateriaal toevoegen';
  showBack = false;
  isOpen = false;
  countProgress = 0;

  constructor() {}

  ngOnInit() {
    setInterval(
      () =>
        this.countProgress < 50
          ? this.countProgress++
          : (this.countProgress = 0),
      500
    );
  }

  clickEmptyCta() {
    console.log('Empty State CTA Clicked!');
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

  clickOtherBook() {
    this.showBack = true;
    this.backHeaderTitle = 'Selecteer een ander boek';
  }
  onDroppedChanged(dropped: boolean) {
    this.showBack = dropped;
    if (!dropped) {
      this.backHeaderTitle = 'Lesmateriaal toevoegen';
    }
  }

  changeMode(mode: SectionModeEnum) {
    this.sectionMode = mode;
  }

  handleTriggerActionClick(event: MouseEvent) {
    console.log('icon clicked');
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
