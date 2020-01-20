import {
  Component,
  EventEmitter,
  Input,
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
  label: string;
  value: AssigneeInterface[];
  order: number;
}

@Component({
  selector: 'campus-manage-kabas-tasks-add-assignees',
  templateUrl: './manage-kabas-tasks-add-assignees.component.html',
  styleUrls: ['./manage-kabas-tasks-add-assignees.component.scss']
})
export class ManageKabasTasksAddAssigneesComponent implements OnInit {
  public filteredAssignees$: Observable<AssigneesByType[]>;
  public filterState$ = new BehaviorSubject<AddAssigneeFilterState>({});
  @ViewChildren(MatSelectionList)
  private selectedAssignees: MatSelectionList[];
  @ViewChild(SearchTermComponent, { static: false })
  private searchTermFilter: SearchTermComponent;
  @Input() public students: AssigneeInterface[] = [
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
  @Input() public groups: AssigneeInterface[] = [
    {
      type: AssigneeTypesEnum.GROUP,
      label: 'Remediëring 2c',
      start: new Date(),
      end: new Date(),
      id: 2
    }
  ];
  @Input() public classgroups: AssigneeInterface[] = [
    {
      type: AssigneeTypesEnum.CLASSGROUP,
      label: '1A',
      start: new Date(),
      end: new Date(),
      id: 1
    }
  ];
  @Output() addedAssignees = new EventEmitter<AssigneeInterface[]>();

  constructor() {}

  ngOnInit() {
    this.filteredAssignees$ = this.filterState$.pipe(
      map((filterState: AddAssigneeFilterState): AssigneesByType[] => {
        if (filterState.label) {
          return this.filter(
            [...this.students, ...this.groups, ...this.classgroups],
            filterState
          );
        } else {
          return [
            ...(this.students.length
              ? [{ label: 'Studenten', value: this.students, order: 1 }]
              : []),
            ...(this.groups.length
              ? [{ label: 'Groepen', value: this.groups, order: 2 }]
              : []),
            ...(this.classgroups.length
              ? [{ label: 'Klasgroepen', value: this.classgroups, order: 3 }]
              : [])
          ];
        }
      })
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

  public clearSelection() {
    this.selectedAssignees.forEach(list => list.selectedOptions.clear());
    this.resetFilter();
  }

  addAssignees() {
    const assignees = this.selectedAssignees.reduce((acc, element) => {
      return [
        ...acc,
        ...element.selectedOptions.selected.map(selection => selection.value)
      ];
    }, []);

    this.clearSelection();
    this.addedAssignees.emit(assignees);
  }

  private filter(
    assignees: AssigneeInterface[],
    filterState: AddAssigneeFilterState
  ): AssigneesByType[] {
    let filteredAssignees = [...assignees];

    if (filterState.label) {
      filteredAssignees = filteredAssignees.filter(assignee => {
        return assignee.label
          .toLowerCase()
          .includes(filterState.label.toLowerCase());
      });
    }

    return [
      ...(filteredAssignees.length
        ? [{ label: 'Resultaten', value: filteredAssignees, order: 1 }]
        : [])
    ];
  }
}
