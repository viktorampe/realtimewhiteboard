import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../../interfaces/Assignee.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';

interface AddAssigneeFilterState {
  label?: string;
}

interface AssigneesByType {
  students: AssigneeInterface[];
  groups: AssigneeInterface[];
  classGroups: AssigneeInterface[];
  results?: AssigneeInterface[];
}

@Component({
  selector: 'campus-add-assignees',
  templateUrl: './add-assignee.component.html',
  styleUrls: ['./add-assignee.component.scss']
})
export class AddAssigneeComponent implements OnInit {
  public filteredAssignees$: Observable<AssigneesByType>;

  private filterState$ = new BehaviorSubject<AddAssigneeFilterState>({});

  students: AssigneeInterface[] = [
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
  groups: AssigneeInterface[] = [
    {
      type: AssigneeTypesEnum.GROUP,
      label: 'Remediëring 2c',
      start: new Date(),
      end: new Date(),
      id: 2
    }
  ];
  classgroups: AssigneeInterface[] = [
    {
      type: AssigneeTypesEnum.CLASSGROUP,
      label: '1A',
      start: new Date(),
      end: new Date(),
      id: 1
    }
  ];

  constructor(private viewModel: KabasTasksViewModel) {}

  ngOnInit() {
    this.filteredAssignees$ = this.filterState$.pipe(
      map(
        (filterState: AddAssigneeFilterState): AssigneesByType => {
          if (filterState.label) {
            return this.filter(
              [...this.students, ...this.groups, ...this.classgroups],
              filterState
            );
          } else {
            return {
              students: this.students,
              groups: this.groups,
              classGroups: this.classgroups
            };
          }
        }
      )
    );
  }

  public updateLabelFilter(text: string) {
    this.filterState$.next({
      ...this.filterState$.value,
      label: text
    });
  }

  private filter(
    assignees: AssigneeInterface[],
    filterState: AddAssigneeFilterState
  ): AssigneesByType {
    let filteredAssignees = [...assignees];

    if (filterState.label) {
      filteredAssignees = filteredAssignees.filter(assignee => {
        return assignee.label
          .toLowerCase()
          .includes(filterState.label.toLowerCase());
      });
    }

    return {
      students: [],
      groups: [],
      classGroups: [],
      results: filteredAssignees
    };
  }

  // public sortAssignees(students, groups, classgroups) {
  //   this.allDataTogether.sort(function(a, b) {
  //     const order = {
  //       [AssigneeTypesEnum.CLASSGROUP]: 1,
  //       [AssigneeTypesEnum.GROUP]: 2,
  //       [AssigneeTypesEnum.STUDENT]: 3
  //     };
  //     return (
  //       order[a.type] - order[b.type] ||
  //       (a.label > b.label ? 1 : b.label > a.label ? -1 : 0)
  //     );
  //   });
  // }
}
