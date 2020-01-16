//file.only

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatListModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchModule } from '@campus/search';
import { UiModule } from '@campus/ui';
import { hot } from '@nrwl/angular/testing';
import { configureTestSuite } from 'ng-bullet';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../../interfaces/Assignee.interface';
import { AddAssigneeComponent } from './add-assignee.component';

describe('AddAssigneeComponent', () => {
  let component: AddAssigneeComponent;
  let fixture: ComponentFixture<AddAssigneeComponent>;
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
      id: 2
    }
  ];
  const mockClassgroups: AssigneeInterface[] = [
    {
      type: AssigneeTypesEnum.CLASSGROUP,
      label: '1A',
      start: new Date(),
      end: new Date(),
      id: 1
    }
  ];
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        MatDialogModule,
        MatListModule,
        SearchModule,
        NoopAnimationsModule
      ],
      declarations: [AddAssigneeComponent],
      providers: [
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssigneeComponent);
    component = fixture.componentInstance;
    component.students = mockStudents;
    component.groups = mockGroups;
    component.classgroups = mockClassgroups;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //
  // Test output emit with right data when clicking add

  describe('filteredAssignees$', () => {
    it('should filter on searchTerm', () => {
      component.filterState$.next({
        label: 'a'
      });

      const expected = {
        students: [],
        groups: [],
        classgroups: [],
        results: [mockStudents[0], mockClassgroups[0]]
      };

      expect(component.filteredAssignees$).toBeObservable(
        hot('a', {
          a: expected
        })
      );
    });

    it('should return students, groups and classGroups when there is no filter', () => {
      component.filterState$.next({});

      const expected = {
        students: mockStudents,
        groups: mockGroups,
        classgroups: mockClassgroups
      };

      expect(component.filteredAssignees$).toBeObservable(
        hot('a', {
          a: expected
        })
      );
    });
  });
});
