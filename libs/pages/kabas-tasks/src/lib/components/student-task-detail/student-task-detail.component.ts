import { Component, HostBinding, Inject } from '@angular/core';
import {
  ContentOpenActionsServiceInterface,
  CONTENT_OPEN_ACTIONS_SERVICE_TOKEN
} from '@campus/shared';
import { SectionModeEnum } from '@campus/ui';
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

  constructor(
    private viewModel: StudentTasksViewModel,
    @Inject(CONTENT_OPEN_ACTIONS_SERVICE_TOKEN)
    private openerService: ContentOpenActionsServiceInterface
  ) {
    this.task$ = this.viewModel.currentTask$;
    this.requiredTaskContents$ = this.task$.pipe(
      map(task => {
        return task.contents.reduce(
          (requiredContents, content) =>
            this.toFilteredContent(true, requiredContents, content),
          []
        );
      })
    );

    this.optionalTaskContents$ = this.task$.pipe(
      map(task => {
        return task.contents.reduce(
          (requiredContents, content) =>
            this.toFilteredContent(false, requiredContents, content),
          []
        );
      })
    );
  }

  private toFilteredContent(
    required: boolean,
    requiredContents: StudentTaskContentInterface[],
    content: StudentTaskContentInterface
  ) {
    if (!required) {
      // TODO: add actions through service
      requiredContents.push({
        ...content,
        actions: this.openerService.getActionsForTaskInstanceEduContent(
          null,
          null,
          null
        )
      });
    }

    return requiredContents;
  }
}
