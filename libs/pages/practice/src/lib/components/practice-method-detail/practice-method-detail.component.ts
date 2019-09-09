import { Component, OnInit } from '@angular/core';
import {
  ClassGroupInterface,
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
import { map, take } from 'rxjs/operators';
import {
  CurrentPracticeParams,
  PracticeViewModel
} from '../practice.viewmodel';

@Component({
  selector: 'campus-practice-method-detail',
  templateUrl: './practice-method-detail.component.html',
  styleUrls: ['./practice-method-detail.component.scss']
})
export class PracticeMethodDetailComponent implements OnInit {
  private bookId$: Observable<number>;

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
    this.bookId$ = this.getCurrentBookId();
    this.unlockedFreePracticeTableRowHeaders = this.viewModel.unlockedFreePracticeTableRowHeaders;
    this.classGroupColumns$ = this.viewModel.unlockedFreePracticeTableItemColumns$;
    this.eduContentTOCsWithSelectionForClassGroups$ = this.viewModel.unlockedFreePracticeTableItems$;
  }

  clickFreePracticeForBook(
    event: MultiCheckBoxTableColumnChangeEventInterface<ClassGroupInterface>
  ) {
    this.bookId$.pipe(take(1)).subscribe(bookId => {
      const unlockedFreePractice = this.createUnlockedFreePractice(
        event.column.id, // classGroup
        bookId
      );

      this.viewModel.toggleUnlockedFreePractice(
        [unlockedFreePractice],
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
    const unlockedFreePractice = this.createUnlockedFreePractice(
      event.column.id, // classGroup
      event.item.treeId, // book id
      event.item.id // eduContentTOC id
    );

    this.viewModel.toggleUnlockedFreePractice(
      [unlockedFreePractice],
      event.isChecked
    );
  }

  private getCurrentBookId(): Observable<number> {
    return this.viewModel.currentPracticeParams$.pipe(
      map((params: CurrentPracticeParams) => params.book)
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
