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
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../../interfaces/Assignee.interface';

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
    map: { [id: number]: boolean };
    isTypeInFilter: { [label: string]: boolean };
  };
  public assignees: AssigneesByType[];

  @ViewChild('assigneeList', { static: false })
  public assigneeList: MatSelectionList;
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
    this.filter(text);
  }

  public resetFilter() {
    this.searchTermFilter.currentValue = '';
    this.filter('');
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
        item.value.forEach(assignee => {
          if (assignee.label.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
            acc.map[assignee.id] = true;
            acc.isTypeInFilter[item.label] = true;
          }
        });

        return acc;
      },
      { map: {}, isTypeInFilter: {} }
    );
  }
}
