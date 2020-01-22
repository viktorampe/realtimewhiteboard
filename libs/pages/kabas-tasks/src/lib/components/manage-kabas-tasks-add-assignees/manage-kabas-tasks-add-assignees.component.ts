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
import { AssigneeInterface } from './../../interfaces/Assignee.interface';

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
  public filteredAssignees: {
    map: { [id: number]: boolean };
    isTypeInFilter: { [label: string]: boolean };
  };
  public assignees: AssigneesByType[];

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
    this.assignees = [
      ...(this.classgroups.length
        ? [{ label: 'Klasgroepen', value: this.classgroups }]
        : []),
      ...(this.groups.length ? [{ label: 'Groepen', value: this.groups }] : []),
      ...(this.students.length
        ? [{ label: 'Studenten', value: this.students }]
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

    this.close(assignees);
  }

  close(assignees: AssigneeInterface[]) {
    this.clearSelection();
    this.addedAssignees.emit(assignees || []);
  }

  private filter(text: string) {
    this.filteredAssignees = this.assignees.reduce(
      (acc, item) => {
        item.value.forEach(assignee => {
          if (assignee.label.toLowerCase().includes(text.toLowerCase())) {
            acc.map[assignee.type + '-' + assignee.relationId] = true;
            acc.isTypeInFilter[item.label] = true;
          }
        });

        return acc;
      },
      { map: {}, isTypeInFilter: {} }
    );
  }
}
