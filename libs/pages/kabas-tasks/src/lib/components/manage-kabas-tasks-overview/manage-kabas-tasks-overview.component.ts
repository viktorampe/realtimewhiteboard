import { Component, OnInit } from '@angular/core';
import { AssigneeType } from '../task-list-item/task-list-item.component';

@Component({
  selector: 'campus-manage-kabas-tasks-overview',
  templateUrl: './manage-kabas-tasks-overview.component.html',
  styleUrls: ['./manage-kabas-tasks-overview.component.scss']
})
export class ManageKabasTasksOverviewComponent implements OnInit {
  public taskItem = {
    startDate: new Date(2019, 11, 1),
    endDate: new Date(2019, 11, 21),
    actions: [
      { label: 'bekijken', handler: () => console.log('bekijken') },
      { label: 'archiveren', handler: () => console.log('archiveren') },
      { label: 'resultaten', handler: () => console.log('resultaten') },
      { label: 'doelenmatrix', handler: () => console.log('doelenmatrix') }
    ],
    assignees: [
      {
        type: AssigneeType.CLASSGROUP,
        label: 'Klas 1',
        start: new Date(2019, 11, 1),
        end: new Date(2019, 11, 8)
      },
      {
        type: AssigneeType.CLASSGROUP,
        label: 'Klas 2',
        start: new Date(2019, 11, 8),
        end: new Date(2019, 11, 21)
      },
      {
        type: AssigneeType.STUDENT,
        label: 'Leerling 1',
        start: new Date(2019, 11, 1),
        end: new Date(2019, 11, 8)
      },
      {
        type: AssigneeType.STUDENT,
        label: 'Leerling 2',
        start: new Date(2019, 11, 1),
        end: new Date(2019, 11, 8)
      },
      {
        type: AssigneeType.GROUP,
        label: 'Groep 1',
        start: new Date(2019, 11, 8),
        end: new Date(2019, 11, 21)
      }
    ]
  };
  constructor() {}

  ngOnInit() {}
}
