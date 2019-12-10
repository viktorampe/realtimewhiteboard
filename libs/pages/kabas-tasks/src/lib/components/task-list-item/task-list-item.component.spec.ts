import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatIconRegistry,
  MatTooltipModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { ENVIRONMENT_ICON_MAPPING_TOKEN } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { AssigneeFixture } from '../../interfaces/Assignee.fixture';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../../interfaces/Assignee.interface';
import { TaskListItemComponent } from './task-list-item.component';

const mockAssignees: AssigneeInterface[] = [
  new AssigneeFixture({
    label: 'class_group_2',
    type: AssigneeTypesEnum.CLASSGROUP
  }),
  new AssigneeFixture({
    label: 'class_group_1',
    type: AssigneeTypesEnum.CLASSGROUP
  }),
  new AssigneeFixture({
    label: 'class_group_3',
    type: AssigneeTypesEnum.CLASSGROUP
  }),
  new AssigneeFixture({
    label: 'group_2',
    type: AssigneeTypesEnum.GROUP
  }),
  new AssigneeFixture({
    label: 'group_1',
    type: AssigneeTypesEnum.GROUP
  }),
  new AssigneeFixture({
    label: 'student_1',
    type: AssigneeTypesEnum.STUDENT
  }),
  new AssigneeFixture({
    label: 'student_2',
    type: AssigneeTypesEnum.STUDENT
  })
];

describe('TaskListItemComponent', () => {
  let component: TaskListItemComponent;
  let fixture: ComponentFixture<TaskListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatTooltipModule],
      declarations: [TaskListItemComponent],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListItemComponent);
    component = fixture.componentInstance;
    component.title = 'foo';
    component.actions = [
      { label: 'Action1', handler: jest.fn() },
      { label: 'Action2', handler: jest.fn() }
    ];
    component.assignees = mockAssignees;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should pass action handlers', () => {
      const actionDEs = fixture.debugElement.queryAll(
        By.css('.manage-kabas-tasks-task-list-item__container__actions > span')
      );

      expect(actionDEs.length).toBe(component.actions.length);
      actionDEs.forEach((actionDE, index) => {
        const action = component.actions[index];

        expect(actionDE.nativeElement.textContent).toBe(action.label);

        actionDE.nativeElement.click();
        expect(action.handler).toHaveBeenCalled();
      });
    });
    it('should group and sort assignees by AssigneeType', () => {
      expect(component.classGroups.map(cg => cg.label)).toEqual([
        'class_group_1',
        'class_group_2',
        'class_group_3'
      ]);
      expect(component.groups).toEqual(['group_1', 'group_2']);
      expect(component.students).toEqual(['student_1', 'student_2']);
      expect(component.assignees.map(a => a.label)).toEqual([
        'class_group_1',
        'class_group_2',
        'class_group_3',
        'group_1',
        'group_2',
        'student_1',
        'student_2'
      ]);
    });
  });
});
