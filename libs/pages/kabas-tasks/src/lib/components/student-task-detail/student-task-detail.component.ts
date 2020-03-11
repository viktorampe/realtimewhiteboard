import { Component, HostBinding } from '@angular/core';
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

  constructor(private viewModel: StudentTasksViewModel) {
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
      requiredContents.push(content);
    }

    return requiredContents;
  }
}
