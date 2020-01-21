import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule, MatSelectionList } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchModule } from '@campus/search';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../../interfaces/Assignee.interface';
import { ManageKabasTasksAddAssigneesComponent } from './manage-kabas-tasks-add-assignees.component';

describe('AddAssigneeComponent', () => {
  let component: ManageKabasTasksAddAssigneesComponent;
  let fixture: ComponentFixture<ManageKabasTasksAddAssigneesComponent>;
  const mockStudents: AssigneeInterface[] = [
    {
      type: AssigneeTypesEnum.STUDENT,
      label: 'Anneke',
      start: new Date(),
      end: new Date(),
      id: 1
    },
    {
      type: AssigneeTypesEnum.STUDENT,
      label: 'Ronny',
      start: new Date(),
      end: new Date(),
      id: 2
    }
  ];
  const mockGroups: AssigneeInterface[] = [
    {
      type: AssigneeTypesEnum.GROUP,
      label: 'Remediëring 2c',
      start: new Date(),
      end: new Date(),
      id: 3
    }
  ];
  const mockClassgroups: AssigneeInterface[] = [
    {
      type: AssigneeTypesEnum.CLASSGROUP,
      label: '1A',
      start: new Date(),
      end: new Date(),
      id: 4
    }
  ];
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, MatListModule, SearchModule, NoopAnimationsModule],
      declarations: [ManageKabasTasksAddAssigneesComponent],
      providers: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKabasTasksAddAssigneesComponent);
    component = fixture.componentInstance;
    component.students = mockStudents;
    component.groups = mockGroups;
    component.classgroups = mockClassgroups;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filtering', () => {
    it('should filter on searchTerm', () => {
      component.updateLabelFilter('ro');

      const expected = {
        map: {
          2: true
        },
        isTypeInFilter: {
          Studenten: true
        }
      };

      expect(component.filteredAssignees).toEqual(expected);
    });

    it('should return students, groups and classGroups when there is no filter', () => {
      component.updateLabelFilter('');

      const expected = {
        map: {
          1: true,
          2: true,
          3: true,
          4: true
        },
        isTypeInFilter: {
          Studenten: true,
          Groepen: true,
          Klasgroepen: true
        }
      };

      expect(component.filteredAssignees).toEqual(expected);
    });
    it('should return empty results if filtertext is not included in a name', () => {
      component.updateLabelFilter('akq');

      const expected = {
        map: {},
        isTypeInFilter: {}
      };

      expect(component.filteredAssignees).toEqual(expected);
    });
  });
  describe('emitValues', () => {
    it('should emit the correct values when clicked add', () => {
      const result = [mockStudents[0]];

      const selectionList = fixture.debugElement.query(
        By.css('mat-selection-list')
      ).componentInstance as MatSelectionList;

      selectionList.selectedOptions.select(selectionList.options.first);

      jest.spyOn(component.addedAssignees, 'emit');
      component.addAssignees();
      expect(component.addedAssignees.emit).toHaveBeenCalledWith(result);
    });
  });
});
