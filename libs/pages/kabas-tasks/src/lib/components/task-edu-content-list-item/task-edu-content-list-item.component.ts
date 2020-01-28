import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { ContentActionInterface } from '@campus/shared';

@Component({
  selector: 'campus-task-edu-content-list-item',
  templateUrl: './task-edu-content-list-item.component.html',
  styleUrls: ['./task-edu-content-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskEduContentListItemComponent implements OnInit {
  @Input() title: string;
  @Input() level: string;
  @Input() required: boolean;
  @Input() fileIcon: string;
  @Input() diaboloPhaseIcon: string;
  @Input() actions: ContentActionInterface[];

  constructor() {}

  ngOnInit() {}
}
