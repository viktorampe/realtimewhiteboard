import { Component, Input, OnInit } from '@angular/core';
import { ResultStatus } from '@campus/dal';
import { TaskActionInterface } from '@campus/shared';

@Component({
  selector: 'campus-student-task-content-list-item',
  templateUrl: './student-task-content-list-item.component.html',
  styleUrls: ['./student-task-content-list-item.component.scss']
})
export class StudentTaskContentListItemComponent implements OnInit {
  @Input() fileIcon: string;
  @Input() title: string;
  @Input() description?: string;
  @Input() isFinished: boolean;
  @Input() lastUpdated: Date;
  @Input() score: number;
  @Input() status: ResultStatus;
  @Input() actions: TaskActionInterface[];

  constructor() {}

  ngOnInit() {}
}
