import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ClassGroupFixture,
  ClassGroupInterface,
  EduContentBookFixture,
  EduContentTOCFixture,
  EduContentTOCInterface,
  UnlockedFreePracticeFixture,
  UnlockedFreePracticeInterface
} from '@campus/dal';
import { ENVIRONMENT_SEARCHMODES_TOKEN } from '@campus/shared';
import {
  MultiCheckBoxTableColumnChangeEventInterface,
  MultiCheckBoxTableComponent,
  MultiCheckBoxTableItemChangeEventInterface,
  MultiCheckBoxTableItemColumnInterface,
  UiModule
} from '@campus/ui';
import { EduContentBookInterface } from '@diekeure/polpo-api-angular-sdk';
import { Dictionary } from '@ngrx/entity';
import { hot } from '@nrwl/nx/testing';
import { configureTestSuite } from 'ng-bullet';
import { PracticeViewModel } from '../practice.viewmodel';
import { MockPracticeViewModel } from '../practice.viewmodel.mock';
import { ManagePracticeMethodDetailComponent } from './manage-practice-method-detail.component';

describe('ManagePracticeMethodDetailComponent', () => {
  let component: ManagePracticeMethodDetailComponent;
  let fixture: ComponentFixture<ManagePracticeMethodDetailComponent>;
  let viewModel: MockPracticeViewModel;
  const mockBook: EduContentBookInterface = new EduContentBookFixture({
    id: 5
  });
  const mockEduContentTOC = new EduContentTOCFixture({ id: 2, treeId: 4 });
  const mockClassGroup = new ClassGroupFixture({ id: 5 });
  let multiCheckboxTable: MultiCheckBoxTableComponent<any, any, any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePracticeMethodDetailComponent],
      providers: [
        { provide: PracticeViewModel, useClass: MockPracticeViewModel },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        }
      ],
      imports: [UiModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePracticeMethodDetailComponent);
    component = fixture.componentInstance;
    viewModel = TestBed.get(PracticeViewModel);
    viewModel.currentPracticeParams$.next({ book: mockBook.id });
    multiCheckboxTable = fixture.debugElement.query(
      By.directive(MultiCheckBoxTableComponent)
    ).componentInstance;
    fixture.detectChanges();
  });
  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('MultiCheckBoxTable', () => {
    const mockClassGroupsByMethodId = [
      new ClassGroupFixture({ id: 1, name: '1a' }),
      new ClassGroupFixture({ id: 2, name: '1b' })
    ];

    const unlockedFreePracticeByEduContentBookId: Dictionary<
      UnlockedFreePracticeInterface[]
    > = {
      5: [
        new UnlockedFreePracticeFixture({
          id: 1,
          eduContentBookId: 5,
          eduContentTOCId: undefined,
          classGroupId: 1
        })
      ]
    };

    const mockBookChapters = [
      new EduContentTOCFixture({ id: 1 }),
      new EduContentTOCFixture({ id: 2 }),
      new EduContentTOCFixture({ id: 3 })
    ];

    const unlockedFreePracticeByEduContentTOCId: Dictionary<
      UnlockedFreePracticeInterface[]
    > = {
      1: [
        new UnlockedFreePracticeFixture({
          id: 1,
          eduContentBookId: 1,
          eduContentTOCId: 1,
          classGroupId: 1
        })
      ],
      2: [
        new UnlockedFreePracticeFixture({
          id: 1,
          eduContentBookId: 1,
          eduContentTOCId: 2,
          classGroupId: 2
        })
      ]
    };

    beforeEach(() => {
      viewModel.unlockedFreePracticeByEduContentBookId$.next(
        unlockedFreePracticeByEduContentBookId
      );
      viewModel.filteredClassGroups$.next(mockClassGroupsByMethodId);
      viewModel.bookChapters$.next(mockBookChapters);
      viewModel.unlockedFreePracticeByEduContentTOCId$.next(
        unlockedFreePracticeByEduContentTOCId
      );
    });

    it('should have table row headers', () => {
      expect(component.unlockedFreePracticeTableRowHeaders).toEqual([
        { caption: 'Hoofdstuk', key: 'title' }
      ]);
    });

    describe('classGroupColumns$', () => {
      it('should return table item columns based on the classgroups', () => {
        //ClassGroup 1 should have all selected, ClassGroup 2 not

        const expectedGroupColumns: MultiCheckBoxTableItemColumnInterface<
          ClassGroupInterface
        >[] = [
          {
            item: mockClassGroupsByMethodId[0],
            key: 'id',
            label: 'name',
            isAllSelected: true
          },
          {
            item: mockClassGroupsByMethodId[1],
            key: 'id',
            label: 'name',
            isAllSelected: false
          }
        ];
        expect(component.classGroupColumns$).toBeObservable(
          hot('a', { a: expectedGroupColumns })
        );
      });
    });

    describe('eduContentTOCsWithSelectionForClassGroups$', () => {
      it('should return items based on the unlocked free practices and classgroups', () => {
        const expected = [
          {
            header: mockBookChapters[0],
            content: { 1: true, 2: false }
          },
          {
            header: mockBookChapters[1],
            content: { 1: false, 2: true }
          },
          {
            header: mockBookChapters[2],
            content: { 1: false, 2: false }
          }
        ];

        expect(
          component.eduContentTOCsWithSelectionForClassGroups$
        ).toBeObservable(hot('a', { a: expected }));
      });
    });
  });

  describe('clickFreePracticeForBook()', () => {
    it('should be triggered by multi-check-box-table selectAllForColumnChanged output', () => {
      jest.spyOn(component, 'clickFreePracticeForBook');

      multiCheckboxTable.selectAllForColumnChanged.emit('foo');
      expect(component.clickFreePracticeForBook).toHaveBeenCalledTimes(1);
      expect(component.clickFreePracticeForBook).toHaveBeenCalledWith('foo');
    });
    it('should call viewmodel.toggleUnlockedFreePractice()', () => {
      const eventData: MultiCheckBoxTableColumnChangeEventInterface<any> = {
        column: mockClassGroup,
        isChecked: true
      };

      jest.spyOn(viewModel, 'toggleUnlockedFreePractice');
      component.clickFreePracticeForBook(eventData);

      expect(viewModel.toggleUnlockedFreePractice).toHaveBeenCalledTimes(1);
      expect(viewModel.toggleUnlockedFreePractice).toHaveBeenCalledWith(
        [
          {
            classGroupId: eventData.column.id,
            eduContentBookId: mockBook.id,
            eduContentTOCId: null
          }
        ],
        true
      );
    });
  });

  describe('clickFreePracticeForChapter()', () => {
    const tableItemChangeEventData: MultiCheckBoxTableItemChangeEventInterface<
      EduContentTOCInterface,
      ClassGroupInterface,
      any
    > = {
      column: mockClassGroup,
      item: mockEduContentTOC,
      subLevel: undefined,
      isChecked: false
    };

    it('should be triggered by multi-check-box-table checkBoxChanged output', () => {
      jest
        .spyOn(component, 'clickFreePracticeForChapter')
        .mockImplementationOnce(() => {});

      multiCheckboxTable.checkBoxChanged.emit(tableItemChangeEventData);
      expect(component.clickFreePracticeForChapter).toHaveBeenCalledTimes(1);
      expect(component.clickFreePracticeForChapter).toHaveBeenCalledWith(
        tableItemChangeEventData
      );
    });

    it('should call viewmodel.toggleUnlockedFreePractice()', () => {
      jest.spyOn(viewModel, 'toggleUnlockedFreePractice');
      component.clickFreePracticeForChapter(tableItemChangeEventData);

      expect(viewModel.toggleUnlockedFreePractice).toHaveBeenCalledTimes(1);
      expect(viewModel.toggleUnlockedFreePractice).toHaveBeenCalledWith(
        [
          {
            classGroupId: tableItemChangeEventData.column.id,
            eduContentBookId: tableItemChangeEventData.item.treeId,
            eduContentTOCId: tableItemChangeEventData.item.id
          }
        ],
        false
      );
    });
  });
});
