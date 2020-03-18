import { Component, HostBinding, Inject } from '@angular/core';
import {
  ContentOpenActionsServiceInterface,
  ContentOpenActionsStudentService,
  CONTENT_OPEN_ACTIONS_SERVICE_TOKEN
} from '@campus/shared';
import {
  getHumanDateTimeRules,
  HumanDateTimeArgsInterface,
  humanDateTimeRulesEnum,
  SectionModeEnum
} from '@campus/ui';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { StudentTaskContentInterface } from '../../interfaces/StudentTaskContent.interface';
import { StudentTaskWithContentInterface } from '../../interfaces/StudentTaskWithContent.interface';
import { StudentTasksViewModel } from '../student-tasks.viewmodel';
import { MockStudentTasksViewModel } from '../student-tasks.viewmodel.mock';

@Component({
  selector: 'campus-student-task-detail',
  templateUrl: './student-task-detail.component.html',
  styleUrls: ['./student-task-detail.component.scss'],
  providers: [
    { provide: StudentTasksViewModel, useClass: MockStudentTasksViewModel },
    {
      provide: CONTENT_OPEN_ACTIONS_SERVICE_TOKEN,
      useClass: ContentOpenActionsStudentService
    }
  ]
})
export class StudentTaskDetailComponent {
  sectionModes = SectionModeEnum;

  public task$: Observable<StudentTaskWithContentInterface>;
  public requiredTaskContents$: Observable<StudentTaskContentInterface[]>;
  public optionalTaskContents$: Observable<StudentTaskContentInterface[]>;

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

  @HostBinding('class.student-task-detail')
  studentTaskDetailClass = true;

  constructor(
    private viewModel: StudentTasksViewModel,
    @Inject(CONTENT_OPEN_ACTIONS_SERVICE_TOKEN)
    private contentOpenActionsService: ContentOpenActionsServiceInterface
  ) {
    this.task$ = this.viewModel.currentTask$.pipe(
      map(task => ({
        ...task,
        contents: task.contents.map(content => ({
          ...content,
          actions: this.contentOpenActionsService.getActionsForTaskInstanceEduContent(
            content.eduContent,
            content,
            task
          )
        }))
      })),
      shareReplay(1)
    );

    this.requiredTaskContents$ = this.task$.pipe(
      map(task => task.contents.filter(content => content.required))
    );

    this.optionalTaskContents$ = this.task$.pipe(
      map(task => task.contents.filter(content => !content.required))
    );
  }
}
