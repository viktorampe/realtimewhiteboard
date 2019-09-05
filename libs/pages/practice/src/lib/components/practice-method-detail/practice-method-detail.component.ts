import { Component, OnInit } from '@angular/core';
import { ClassGroupInterface, EduContentTOCInterface } from '@campus/dal';
import {
  MultiCheckBoxTableChangeEventInterface,
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface
} from '@campus/ui';
import { Observable } from 'rxjs';
import { PracticeViewModel } from '../practice.viewmodel';

@Component({
  selector: 'campus-practice-method-detail',
  templateUrl: './practice-method-detail.component.html',
  styleUrls: ['./practice-method-detail.component.scss']
})
export class PracticeMethodDetailComponent implements OnInit {
  public breadCrumbTitles$: Observable<string>; // used to show book method + year

  public eduContentTOCsTableHeaders: MultiCheckBoxTableRowHeaderColumnInterface<
    EduContentTOCInterface
  >[];
  public classGroupColumns$: Observable<
    MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[]
  >;
  public eduContentTOCsWithSelectionForClassGroups$: Observable<
    MultiCheckBoxTableItemInterface<EduContentTOCInterface>[]
  >;

  constructor(private viewModel: PracticeViewModel) {}

  ngOnInit() {}

  clickFreePracticeForBook() {}

  clickFreePracticeForChapter(
    event: MultiCheckBoxTableChangeEventInterface<
      EduContentTOCInterface,
      ClassGroupInterface,
      undefined
    >
  ) {
    if (event.previousCheckboxState) {
      // if the checkbox becomes unchecked
      this.viewModel.deleteUnLockedFreePracticeForEduContentTOCClassGroup(
        event.item, // eduContentTOC
        event.column // classgroup
      );
    } else {
      this.viewModel.addUnLockedFreePracticeForEduContentTOCClassGroup(
        event.item, // eduContentTOC
        event.column // classGroup
      );
    }
  }
}
