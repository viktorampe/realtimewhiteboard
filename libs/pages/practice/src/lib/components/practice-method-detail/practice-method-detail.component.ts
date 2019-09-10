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
import { Dictionary } from '@ngrx/entity';
import { combineLatest, Observable } from 'rxjs';
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
  private filteredClassGroups$: Observable<ClassGroupInterface[]>;
  private unlockedFreePracticeByEduContentBookId$: Observable<
    Dictionary<UnlockedFreePracticeInterface[]>
  >;
  private unlockedFreePracticeByEduContentTOCId$: Observable<
    Dictionary<UnlockedFreePracticeInterface[]>
  >;

  public breadCrumbTitles$: Observable<string>; // used to show book method + year

  // MultiCheckBoxTable
  public unlockedFreePracticeTableItems$: Observable<
    MultiCheckBoxTableItemInterface<EduContentTOCInterface>[]
  >;
  public unlockedFreePracticeTableRowHeaders: MultiCheckBoxTableRowHeaderColumnInterface<
    EduContentTOCInterface
  >[];
  public classGroupColumns$: Observable<
    MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[]
  >;
  public eduContentTOCsWithSelectionForClassGroups$: Observable<
    MultiCheckBoxTableItemInterface<EduContentTOCInterface>[]
  >;

  public bookChapters$: Observable<EduContentTOCInterface[]>;

  constructor(private viewModel: PracticeViewModel) {}

  ngOnInit() {
    this.filteredClassGroups$ = this.viewModel.filteredClassGroups$;
    this.unlockedFreePracticeByEduContentBookId$ = this.viewModel.unlockedFreePracticeByEduContentBookId$;
    this.unlockedFreePracticeByEduContentTOCId$ = this.viewModel.unlockedFreePracticeByEduContentTOCId$;
    this.bookChapters$ = this.viewModel.bookChapters$;

    this.breadCrumbTitles$ = this.viewModel.bookTitle$;

    this.bookId$ = this.getCurrentBookId();

    this.unlockedFreePracticeTableRowHeaders = [
      { caption: 'Hoofdstuk', key: 'title' }
    ];

    this.classGroupColumns$ = this.getPracticeTableItemColumnsStream();
    this.eduContentTOCsWithSelectionForClassGroups$ = this.getPracticeTableItemsStream();
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

  private getPracticeTableItemColumnsStream(): Observable<
    MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[]
  > {
    return combineLatest([
      this.filteredClassGroups$,
      this.unlockedFreePracticeByEduContentBookId$,
      this.bookId$
    ]).pipe(
      map(([filteredClassGroups, ufpByBookId, bookId]) => {
        return filteredClassGroups.map(
          (
            classGroup
          ): MultiCheckBoxTableItemColumnInterface<ClassGroupInterface> => ({
            item: classGroup,
            key: 'id',
            label: 'name',
            isAllSelected: this.isAllSelectedForClassGroup(
              bookId,
              ufpByBookId,
              classGroup
            )
          })
        );
      })
    );
  }

  private isAllSelectedForClassGroup(
    currentBookId: number,
    unlockedFreePracticeByBookId: Dictionary<UnlockedFreePracticeInterface[]>,
    classGroup: ClassGroupInterface
  ): boolean {
    return (
      unlockedFreePracticeByBookId[currentBookId] &&
      unlockedFreePracticeByBookId[currentBookId].some(
        item => !item.eduContentTOCId && item.classGroupId === classGroup.id
      )
    );
  }

  private getPracticeTableItemsStream(): Observable<
    MultiCheckBoxTableItemInterface<EduContentTOCInterface>[]
  > {
    return combineLatest([
      this.bookChapters$,
      this.unlockedFreePracticeByEduContentTOCId$,
      this.filteredClassGroups$
    ]).pipe(
      map(([chapterTOCs, unlockedPracticesByTOC, filteredClassGroups]) => {
        return this.createCheckboxItemsForUnlockedFreePractices(
          chapterTOCs,
          filteredClassGroups,
          unlockedPracticesByTOC
        );
      })
    );
  }

  private createCheckboxItemsForUnlockedFreePractices(
    eduContentTOCs: EduContentTOCInterface[],
    classGroups: ClassGroupInterface[],
    unlockedPracticesByTOC: Dictionary<UnlockedFreePracticeInterface[]>
  ): MultiCheckBoxTableItemInterface<EduContentTOCInterface>[] {
    return eduContentTOCs
      .map(eduContentTOC => {
        const unlockedPracticesByClassGroup: Dictionary<boolean> = {};
        classGroups.forEach(classGroup => {
          unlockedPracticesByClassGroup[classGroup.id] = (
            unlockedPracticesByTOC[eduContentTOC.id] || []
          ).some(
            unlockedPractice => unlockedPractice.classGroupId === classGroup.id
          );
        });

        return {
          header: eduContentTOC,
          content: unlockedPracticesByClassGroup
        };
      })
      .sort((a, b) => {
        return a.header.title.localeCompare(b.header.title, undefined, {
          numeric: true
        });
      });
  }
}
