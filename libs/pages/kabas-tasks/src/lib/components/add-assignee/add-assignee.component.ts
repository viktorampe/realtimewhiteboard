import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatSelectionList } from '@angular/material';
import { SearchTermComponent } from '@campus/search';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../../interfaces/Assignee.interface';

interface AddAssigneeFilterState {
  label?: string;
}

interface AssigneesByType {
  students: AssigneeInterface[];
  groups: AssigneeInterface[];
  classgroups: AssigneeInterface[];
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
  @ViewChildren(MatSelectionList)
  private selectedAssignees: MatSelectionList[];
  @ViewChild(SearchTermComponent, { static: false })
  private searchTermFilter: SearchTermComponent;
  @Output() addedAssignees = new EventEmitter<AssigneeInterface[]>();

  //test data must be replaced w/ inputs
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

  constructor() {}

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
              classgroups: this.classgroups
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

  public resetFilter() {
    this.filterState$.next({ label: '' });
    this.searchTermFilter.currentValue = '';
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
      classgroups: [],
      results: filteredAssignees
    };
  }

  addAssignees() {
    const assignees = this.selectedAssignees.reduce((acc, element) => {
      return [
        ...acc,
        ...element.selectedOptions.selected.map(selection => selection.value)
      ];
    }, []);

    this.addedAssignees.emit(assignees);
    this.selectedAssignees.forEach(list => list.selectedOptions.clear());
  }
}
