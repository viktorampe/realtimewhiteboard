import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatSelectionList } from '@angular/material';
import { SearchTermComponent } from '@campus/search';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssigneeInterface } from './../../interfaces/Assignee.interface';

interface AddAssigneeFilterState {
  label?: string;
}

interface AssigneesByType {
  label: string;
  value: AssigneeInterface[];
}

@Component({
  selector: 'campus-manage-kabas-tasks-add-assignees',
  templateUrl: './manage-kabas-tasks-add-assignees.component.html',
  styleUrls: ['./manage-kabas-tasks-add-assignees.component.scss']
})
export class ManageKabasTasksAddAssigneesComponent implements OnInit {
  public filteredAssignees$: Observable<AssigneesByType[]>;
  public filterState$ = new BehaviorSubject<AddAssigneeFilterState>({});

  @Input() public students: AssigneeInterface[] = [];
  @Input() public groups: AssigneeInterface[] = [];
  @Input() public classgroups: AssigneeInterface[] = [];

  @Output() addedAssignees = new EventEmitter<AssigneeInterface[]>();

  @ViewChild(MatSelectionList, { static: false })
  private assigneeList: MatSelectionList;
  @ViewChild(SearchTermComponent, { static: false })
  private searchTermFilter: SearchTermComponent;

  constructor() {}

  ngOnInit() {
    this.filteredAssignees$ = this.filterState$.pipe(
      map((filterState: AddAssigneeFilterState): AssigneesByType[] => {
        if (filterState.label) {
          return this.filter(
            [...this.classgroups, ...this.groups, ...this.students],
            filterState
          );
        } else {
          return [
            ...(this.classgroups.length
              ? [{ label: 'Klasgroepen', value: this.classgroups }]
              : []),
            ...(this.groups.length
              ? [{ label: 'Groepen', value: this.groups }]
              : []),
            ...(this.students.length
              ? [{ label: 'Studenten', value: this.students }]
              : [])
          ];
        }
      })
    );
  }

  public updateLabelFilter(text: string) {
    this.filterState$.next({
      label: text
    });
  }

  public resetFilter() {
    this.filterState$.next({ label: '' });
    this.searchTermFilter.currentValue = '';
  }

  public clearSelection() {
    this.assigneeList.selectedOptions.clear();
    this.resetFilter();
  }

  addAssignees() {
    const assignees = this.assigneeList.selectedOptions.selected.map(
      selection => selection.value
    );

    this.close(assignees);
  }

  close(assignees: AssigneeInterface[]) {
    this.clearSelection();
    this.addedAssignees.emit(assignees || []);
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

    return filteredAssignees.length
      ? [{ label: 'Resultaten', value: filteredAssignees }]
      : [];
  }
}
