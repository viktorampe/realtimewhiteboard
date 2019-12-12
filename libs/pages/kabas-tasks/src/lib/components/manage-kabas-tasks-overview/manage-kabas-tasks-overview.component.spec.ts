import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GuardsModule } from '@campus/guards';
import { PagesSharedModule } from '@campus/pages/shared';
import { SearchModule } from '@campus/search';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { AssigneeTypesEnum } from '../../interfaces/Assignee.interface';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../../interfaces/TaskWithAssignees.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';
import { MockKabasTasksViewModel } from '../kabas-tasks.viewmodel.mock';
import {
  FilterStateInterface,
  ManageKabasTasksOverviewComponent
} from './manage-kabas-tasks-overview.component';

describe('ManageKabasTasksOverviewComponent', () => {
  let component: ManageKabasTasksOverviewComponent;
  let fixture: ComponentFixture<ManageKabasTasksOverviewComponent>;
  let viewModel: KabasTasksViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CommonModule,
        UiModule,
        PagesSharedModule,
        SharedModule,
        SearchModule,
        GuardsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: KabasTasksViewModel,
          useClass: MockKabasTasksViewModel
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} }
      ],
      declarations: [ManageKabasTasksOverviewComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKabasTasksOverviewComponent);
    component = fixture.componentInstance;
    viewModel = TestBed.get(KabasTasksViewModel);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filteredTasks$', () => {
    it('should filter on searchTerm', () => {
      const filterState: FilterStateInterface = { searchTerm: 'foo' };

      const mockTasks = [
        { name: 'foo' },
        { name: 'bar' }
      ] as TaskWithAssigneesInterface[];

      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([mockTasks[0]]);
    });

    it('should filter on status', () => {
      const filterState: FilterStateInterface = {
        status: [TaskStatusEnum.ACTIVE, TaskStatusEnum.FINISHED]
      };

      const mockTasks = [
        {
          assignees: [
            { status: TaskStatusEnum.ACTIVE }, // matches
            { status: TaskStatusEnum.PENDING } // no match
          ]
        },
        { assignees: [{ status: TaskStatusEnum.PENDING }] }, // no match
        { assignees: [{ status: TaskStatusEnum.FINISHED }] } // matches
      ] as TaskWithAssigneesInterface[];

      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([mockTasks[0], mockTasks[2]]);
    });

    it('should filter on learningArea', () => {
      const filterState: FilterStateInterface = { learningArea: [2, 3] };
      const mockTasks = [
        { learningAreaId: 1 },
        { learningAreaId: 2 },
        { learningAreaId: 3 },
        { learningAreaId: 2 }
      ] as TaskWithAssigneesInterface[];
      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([mockTasks[1], mockTasks[2], mockTasks[3]]);
    });

    it('should filter on assignee', () => {
      const filterState: FilterStateInterface = {
        assignee: [
          { type: AssigneeTypesEnum.GROUP, id: 1 },
          { type: AssigneeTypesEnum.STUDENT, id: 1 },
          { type: AssigneeTypesEnum.CLASSGROUP, id: 1 }
        ]
      };

      const mockTasks: TaskWithAssigneesInterface[] = [
        {
          assignees: [
            { type: AssigneeTypesEnum.GROUP, id: 1 }, // matches filter
            { type: AssigneeTypesEnum.STUDENT, id: 3 }, // does not match
            { type: AssigneeTypesEnum.CLASSGROUP, id: 3 } // does not match
          ]
        },
        {
          assignees: [
            { type: AssigneeTypesEnum.GROUP, id: 2 }, // does not match filter
            { type: AssigneeTypesEnum.STUDENT, id: 1 } // matches filter --> task should be included in result
          ]
        },
        {
          assignees: [{ type: AssigneeTypesEnum.STUDENT, id: 1 }]
        },
        {
          assignees: [{ type: AssigneeTypesEnum.STUDENT, id: 2 }] // does not match
        },
        {
          assignees: [{ type: AssigneeTypesEnum.CLASSGROUP, id: 1 }] // matches
        },
        {
          assignees: [{ type: AssigneeTypesEnum.CLASSGROUP, id: 2 }] // does not match
        },
        {
          assignees: [
            { type: AssigneeTypesEnum.STUDENT, id: 666 }, // does not match
            { type: AssigneeTypesEnum.GROUP, id: 666 }, // does not match
            { type: AssigneeTypesEnum.GROUP, id: 1 }, // matches --> should be included
            { type: AssigneeTypesEnum.CLASSGROUP, id: 666 } // does not match
          ]
        }
      ] as TaskWithAssigneesInterface[];

      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([
        mockTasks[0],
        mockTasks[1],
        mockTasks[2],
        mockTasks[4],
        mockTasks[6]
      ]);
    });

    it('should filter on dateInterval', () => {
      const filterState: FilterStateInterface = {
        dateInterval: { gte: new Date(2000, 5, 10), lte: new Date(2000, 5, 20) }
      };

      const mockTasks: TaskWithAssigneesInterface[] = [
        {
          assignees: [
            { start: new Date(2000, 5, 11), end: new Date(2000, 5, 14) } // matches
          ]
        },
        {
          assignees: [
            { start: new Date(2000, 5, 10), end: new Date(2000, 5, 20) } // matches
          ]
        },
        {
          assignees: [
            { start: new Date(2000, 5, 5), end: new Date(2000, 5, 25) } // matches
          ]
        },
        {
          assignees: [
            { start: new Date(2000, 5, 14), end: new Date(2000, 5, 25) } // matches
          ]
        },
        {
          assignees: [
            { start: new Date(2000, 5, 21), end: new Date(2000, 5, 28) } // no match
          ]
        },
        {
          assignees: [
            { start: new Date(2000, 5, 1), end: new Date(2000, 5, 5) } // no match
          ]
        },
        {
          assignees: [
            { start: new Date(2000, 5, 21), end: new Date(2000, 5, 28) }, // no match
            { start: new Date(2000, 5, 12), end: new Date(2000, 5, 19) } // matches
          ]
        }
      ] as TaskWithAssigneesInterface[];

      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([
        mockTasks[0],
        mockTasks[1],
        mockTasks[2],
        mockTasks[3],
        mockTasks[6]
      ]);
    });

    it('should combine multiple filters', () => {
      const filterState: FilterStateInterface = {
        searchTerm: 'foo',
        learningArea: [1],
        status: [TaskStatusEnum.ACTIVE, TaskStatusEnum.PENDING],
        assignee: [
          { type: AssigneeTypesEnum.GROUP, id: 1 },
          { type: AssigneeTypesEnum.CLASSGROUP, id: 2 }
        ],
        dateInterval: { gte: new Date(2000, 1, 1), lte: new Date(2000, 1, 10) }
      };

      const mockTasks = [
        {
          name: 'foo', //matches all filters
          learningAreaId: 1,
          assignees: [
            {
              start: new Date(2000, 1, 2),
              end: new Date(2000, 1, 9),
              type: AssigneeTypesEnum.GROUP,
              id: 1,
              status: TaskStatusEnum.ACTIVE
            }
          ]
        },
        {
          name: 'bar', // does not match search term filter
          learningAreaId: 1,
          assignees: [
            {
              start: new Date(2000, 1, 2),
              end: new Date(2000, 1, 9),
              type: AssigneeTypesEnum.GROUP,
              id: 1,
              status: TaskStatusEnum.ACTIVE
            }
          ]
        },
        {
          name: 'foo', // does not match all filters
          learningAreaId: 2, // does not match
          assignees: [
            {
              start: new Date(2000, 1, 2),
              end: new Date(2000, 1, 9),
              type: AssigneeTypesEnum.GROUP,
              id: 1,
              status: TaskStatusEnum.ACTIVE
            }
          ]
        },
        {
          name: 'foo', // does not match all filters
          learningAreaId: 1,
          assignees: [
            {
              start: new Date(2000, 1, 2),
              end: new Date(2000, 1, 9),
              type: AssigneeTypesEnum.CLASSGROUP, // does not match
              id: 1,
              status: TaskStatusEnum.ACTIVE
            }
          ]
        },
        {
          name: 'foo', // does not match all filters
          learningAreaId: 1,
          assignees: [
            {
              start: new Date(2000, 1, 2),
              end: new Date(2000, 1, 9),
              type: AssigneeTypesEnum.GROUP,
              id: 2, // does not match
              status: TaskStatusEnum.ACTIVE
            }
          ]
        },
        {
          name: 'foo', // does not match all filters
          learningAreaId: 1,
          assignees: [
            {
              start: new Date(2000, 1, 2),
              end: new Date(2000, 1, 9),
              type: AssigneeTypesEnum.GROUP,
              id: 1,
              status: TaskStatusEnum.FINISHED // does not match
            }
          ]
        },
        {
          name: 'foo', // does not match all filters
          learningAreaId: 1,
          assignees: [
            {
              start: new Date(2000, 1, 15), // no match
              end: new Date(2000, 1, 20), // no match
              type: AssigneeTypesEnum.GROUP,
              id: 1,
              status: TaskStatusEnum.PENDING
            }
          ]
        },
        {
          name: 'foobar', //matches all filters
          learningAreaId: 1,
          assignees: [
            {
              start: new Date(2000, 1, 2),
              end: new Date(2000, 1, 9),
              type: AssigneeTypesEnum.GROUP,
              id: 1,
              status: TaskStatusEnum.FINISHED // does not match
            },
            {
              start: new Date(2000, 1, 2),
              end: new Date(2000, 1, 9),
              type: AssigneeTypesEnum.GROUP,
              id: 1,
              status: TaskStatusEnum.PENDING // matches --> include
            }
          ]
        },
        {
          name: 'foobar', //matches all filters
          learningAreaId: 1,
          assignees: [
            {
              start: new Date(2000, 1, 2),
              end: new Date(2000, 1, 9),
              type: AssigneeTypesEnum.GROUP, //matches
              id: 666, // does not match
              status: TaskStatusEnum.PENDING
            },
            {
              start: new Date(2000, 1, 2),
              end: new Date(2000, 1, 9),
              type: AssigneeTypesEnum.CLASSGROUP, //matches
              id: 2, // matches
              status: TaskStatusEnum.PENDING // matches
            }
          ]
        }
      ] as TaskWithAssigneesInterface[];

      const result = component['filterTasks'](filterState, mockTasks);

      expect(result).toEqual([mockTasks[0], mockTasks[7], mockTasks[8]]);
    });
  });
});
