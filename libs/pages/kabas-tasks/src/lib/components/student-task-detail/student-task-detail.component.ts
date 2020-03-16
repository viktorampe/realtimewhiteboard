import { Component, HostBinding } from '@angular/core';
import { ResultStatus } from '@campus/dal';
import {
  getHumanDateTimeRules,
  HumanDateTimeArgsInterface,
  humanDateTimeRulesEnum,
  SectionModeEnum
} from '@campus/ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentTaskContentInterface } from '../../interfaces/StudentTaskContent.interface';
import { StudentTaskWithContentInterface } from '../../interfaces/StudentTaskWithContent.interface';
import { StudentTasksViewModel } from '../student-tasks.viewmodel';

@Component({
  selector: 'campus-student-task-detail',
  templateUrl: './student-task-detail.component.html',
  styleUrls: ['./student-task-detail.component.scss']
})
export class StudentTaskDetailComponent {
  sectionModes = SectionModeEnum;

  @HostBinding('class.student-task-detail')
  studentTaskDetailClass = true;

  public task$: Observable<StudentTaskWithContentInterface>;
  public requiredTaskContents$: Observable<StudentTaskContentInterface[]>;
  public optionalTaskContents$: Observable<StudentTaskContentInterface[]>;
  public taskProgress$: Observable<{ total: number; finished: number }>;

  public dateTimeArguments: HumanDateTimeArgsInterface = {
    rules: getHumanDateTimeRules([
      humanDateTimeRulesEnum.TODAY,
      humanDateTimeRulesEnum.TOMORROW,
      humanDateTimeRulesEnum.DAY_AFTER_TOMORROW,
      humanDateTimeRulesEnum.WEEKDAY,
      humanDateTimeRulesEnum.NEXT_WEEK
    ]),
    datePrefix: 'op'
  };

  constructor(private viewModel: StudentTasksViewModel) {
    this.task$ = this.viewModel.currentTask$;
    this.requiredTaskContents$ = this.task$.pipe(
      map(task => task.contents.filter(content => content.required))
    );
    this.optionalTaskContents$ = this.task$.pipe(
      map(task => task.contents.filter(content => !content.required))
    );
    this.taskProgress$ = this.requiredTaskContents$.pipe(
      map(contents => ({
        total: contents.length,
        finished: contents.filter(
          content => content.status === ResultStatus.STATUS_COMPLETED
        ).length
      }))
    );
  }
}
