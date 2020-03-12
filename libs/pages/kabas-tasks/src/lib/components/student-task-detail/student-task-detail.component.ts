import { Component, HostBinding } from '@angular/core';
import { SectionModeEnum } from '@campus/ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentTaskContentInterface } from '../../interfaces/StudentTaskContent.interface';
import { StudentTaskWithContentInterface } from '../../interfaces/StudentTaskWithContent.interface';
import { StudentTasksViewModel } from '../student-tasks.viewmodel';
import { MockStudentTasksViewModel } from '../student-tasks.viewmodel.mock';

@Component({
  selector: 'campus-student-task-detail',
  templateUrl: './student-task-detail.component.html',
  styleUrls: ['./student-task-detail.component.scss'],
  providers: [
    { provide: StudentTasksViewModel, useClass: MockStudentTasksViewModel }
  ]
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
      map(task => task.contents.filter(content => content.required))
    );
    this.optionalTaskContents$ = this.task$.pipe(
      map(task => task.contents.filter(content => !content.required))
    );
  }
}
