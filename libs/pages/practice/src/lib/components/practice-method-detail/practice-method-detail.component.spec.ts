import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  MultiCheckBoxTableItemChangeEventInterface
} from '@campus/ui';
import { EduContentBookInterface } from '@diekeure/polpo-api-angular-sdk';
import { configureTestSuite } from 'ng-bullet';
import { PracticeViewModel } from '../practice.viewmodel';
import { MockPracticeViewModel } from '../practice.viewmodel.mock';
import { PracticeMethodDetailComponent } from './practice-method-detail.component';

@Component({
  selector: 'campus-multi-check-box-table',
  template: `
    <div>I am a mock multiCheckboxTable</div>
  `
})
export class MockMultiCheckBoxTableComponent {
  @Input() rowHeaderColumns: any;
  @Input() itemColumns: any;
  @Input() items: any;
  @Output() selectAllForColumnChanged = new EventEmitter();
  @Output() checkBoxChanged = new EventEmitter();
}

describe('PracticeMethodDetailComponent', () => {
  let component: PracticeMethodDetailComponent;
  let fixture: ComponentFixture<PracticeMethodDetailComponent>;
  let viewModel: MockPracticeViewModel;
  const mockBook: EduContentBookInterface = new EduContentBookFixture({
    id: 5
  });
  const mockEduContentTOC = new EduContentTOCFixture({ id: 2, treeId: 4 });
  const mockClassGroup = new ClassGroupFixture({ id: 5 });
  let multiCheckboxTable: MockMultiCheckBoxTableComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PracticeMethodDetailComponent,
        MockMultiCheckBoxTableComponent
      ],
      providers: [
        { provide: PracticeViewModel, useClass: MockPracticeViewModel }
      ],
      imports: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeMethodDetailComponent);
    component = fixture.componentInstance;
    viewModel = TestBed.get(PracticeViewModel);
    viewModel.currentPracticeParams$.next({ book: mockBook.id });
    multiCheckboxTable = fixture.debugElement.query(
      By.directive(MockMultiCheckBoxTableComponent)
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
    it('should be triggered by multi-check-box-table checkBoxChanged output', () => {
      jest.spyOn(component, 'clickFreePracticeForChapter');

      multiCheckboxTable.checkBoxChanged.emit('bar');
      expect(component.clickFreePracticeForChapter).toHaveBeenCalledTimes(1);
      expect(component.clickFreePracticeForChapter).toHaveBeenCalledWith('bar');
    });
    it('should call viewmodel.toggleUnlockedFreePractice()', () => {
      const eventData: MultiCheckBoxTableItemChangeEventInterface<
        EduContentTOCInterface,
        ClassGroupInterface,
        any
      > = {
        column: mockClassGroup,
        item: mockEduContentTOC,
        subLevel: undefined,
        isChecked: false
      };

      jest.spyOn(viewModel, 'toggleUnlockedFreePractice');
      component.clickFreePracticeForChapter(eventData);

      expect(viewModel.toggleUnlockedFreePractice).toHaveBeenCalledTimes(1);
      expect(viewModel.toggleUnlockedFreePractice).toHaveBeenCalledWith(
        [
          {
            classGroupId: eventData.column.id,
            eduContentBookId: eventData.item.treeId,
            eduContentTOCId: eventData.item.id
          }
        ],
        false
      );
    });
  });
});
