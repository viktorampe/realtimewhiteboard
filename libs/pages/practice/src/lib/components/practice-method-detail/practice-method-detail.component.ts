import { Component, OnInit } from '@angular/core';
import {
  ClassGroupInterface,
  EduContentBookInterface,
  EduContentTOCInterface,
  UnlockedFreePracticeInterface
} from '@campus/dal';
import {
  MultiCheckBoxTableColumnChangeEventInterface,
  MultiCheckBoxTableItemChangeEventInterface,
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface
} from '@campus/ui';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { PracticeViewModel } from '../practice.viewmodel';

@Component({
  selector: 'campus-practice-method-detail',
  templateUrl: './practice-method-detail.component.html',
  styleUrls: ['./practice-method-detail.component.scss']
})
export class PracticeMethodDetailComponent implements OnInit {
  private book$: Observable<EduContentBookInterface>;

  public breadCrumbTitles$: Observable<string>; // used to show book method + year

  public unlockedFreePracticeTableRowHeaders: MultiCheckBoxTableRowHeaderColumnInterface<
    EduContentTOCInterface
  >[];
  public classGroupColumns$: Observable<
    MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[]
  >;
  public eduContentTOCsWithSelectionForClassGroups$: Observable<
    MultiCheckBoxTableItemInterface<EduContentTOCInterface>[]
  >;

  constructor(private viewModel: PracticeViewModel) {}

  ngOnInit() {
    this.breadCrumbTitles$ = this.viewModel.bookTitle$;
    this.book$ = this.viewModel.currentBook$;
    this.unlockedFreePracticeTableRowHeaders = this.viewModel.unlockedFreePracticeTableRowHeaders;
    this.classGroupColumns$ = this.viewModel.unlockedFreePracticeTableItemColumns$;
    this.eduContentTOCsWithSelectionForClassGroups$ = this.viewModel.unlockedFreePracticeTableItems$;
  }

  clickFreePracticeForBook(
    event: MultiCheckBoxTableColumnChangeEventInterface<ClassGroupInterface>
  ) {
    this.book$.pipe(take(1)).subscribe(book => {
      const unLockedFreePractice = this.createUnlockedFreePractice(
        event.column.id, // classGroup
        book.id
      );

      this.viewModel.toggleUnlockedFreePractice(
        [unLockedFreePractice],
        event.isChecked
      );
    });
  }

  clickFreePracticeForChapter(
    event: MultiCheckBoxTableItemChangeEventInterface<
      EduContentTOCInterface,
      ClassGroupInterface,
      undefined
    >
  ) {
    const unLockedFreePractice = this.createUnlockedFreePractice(
      event.column.id, // classGroup
      event.item.treeId, // book id
      event.item.id // eduContentTOC id
    );

    this.viewModel.toggleUnlockedFreePractice(
      [unLockedFreePractice],
      event.isChecked
    );
  }

  private createUnlockedFreePractice(
    classGroupId: number,
    eduContentBookId: number,
    eduContentTOCId: number = null
  ): UnlockedFreePracticeInterface {
    return {
      eduContentBookId,
      classGroupId,
      eduContentTOCId
    };
  }
}
