import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ClassGroupFixture,
  ClassGroupInterface,
  EduContentBookFixture,
  EduContentTOCFixture,
  EduContentTOCInterface
} from '@campus/dal';
import {
  MultiCheckBoxTableColumnChangeEventInterface,
  MultiCheckBoxTableComponent,
  MultiCheckBoxTableItemChangeEventInterface,
  UiModule
} from '@campus/ui';
import { EduContentBookInterface } from '@diekeure/polpo-api-angular-sdk';
import { configureTestSuite } from 'ng-bullet';
import { PracticeViewModel } from '../practice.viewmodel';
import { MockPracticeViewModel } from '../practice.viewmodel.mock';
import { PracticeMethodDetailComponent } from './practice-method-detail.component';

describe('PracticeMethodDetailComponent', () => {
  let component: PracticeMethodDetailComponent;
  let fixture: ComponentFixture<PracticeMethodDetailComponent>;
  let viewModel: MockPracticeViewModel;
  const mockBook: EduContentBookInterface = new EduContentBookFixture({
    id: 5
  });
  const mockEduContentTOC = new EduContentTOCFixture({ id: 2, treeId: 4 });
  const mockClassGroup = new ClassGroupFixture({ id: 5 });
  let multiCheckboxTable: MultiCheckBoxTableComponent<any, any, any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeMethodDetailComponent],
      providers: [
        { provide: PracticeViewModel, useClass: MockPracticeViewModel }
      ],
      imports: [UiModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeMethodDetailComponent);
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
