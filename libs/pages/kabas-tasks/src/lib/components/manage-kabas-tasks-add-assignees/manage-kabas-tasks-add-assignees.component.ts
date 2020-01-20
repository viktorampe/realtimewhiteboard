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
import { BehaviorSubject } from 'rxjs';
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
  public filteredAssignees: {
    map: { [id: number]: AssigneeInterface };
    isTypeFiltered: { [label: string]: boolean };
  };
  public assignees: AssigneesByType[];
  public filterState$ = new BehaviorSubject<AddAssigneeFilterState>({});
  @ViewChild(MatSelectionList, { static: false })
  private assigneeList: MatSelectionList;
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
      id: 3
    }
  ];
  @Input() public classgroups: AssigneeInterface[] = [
    {
      type: AssigneeTypesEnum.CLASSGROUP,
      label: '1A',
      start: new Date(),
      end: new Date(),
      id: 4
    }
  ];
  @Output() addedAssignees = new EventEmitter<AssigneeInterface[]>();

  constructor() {}

  ngOnInit() {
    this.assignees = [
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

    this.filter('');
  }

  public updateLabelFilter(text: string) {
    console.log(text);
    this.filter(text);
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

    this.clearSelection();
    this.addedAssignees.emit(assignees);
  }

  private filter(text: string) {
    this.filteredAssignees = this.assignees.reduce(
      (acc, item) => {
        const filteredValues = item.value.filter(
          filteredItem =>
            filteredItem.label.toLowerCase().indexOf(text.toLowerCase()) !== -1
        );

        console.log(item);

        filteredValues.forEach(value => {
          acc.map[value.id] = true;
        });

        acc.isTypeFiltered[item.label] = filteredValues.length === 0;

        return acc;
      },
      { map: {}, isTypeFiltered: {} }
    );

    console.log(this.filteredAssignees);
  }
}
