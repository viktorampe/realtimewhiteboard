import { Inject, Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContent,
  getRouterStateParams,
  ResultInterface,
  TaskInterface
} from '@campus/dal';
import {
  ContentOpenerInterface,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  ResultOpenerInterface,
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN,
  StudentTaskOpenerInterface
} from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';
import { studentTasks } from './student-tasks.viewmodel.selectors';

@Injectable({
  providedIn: 'root'
})
export class StudentTasksViewModel
  implements
    ContentOpenerInterface,
    ResultOpenerInterface,
    StudentTaskOpenerInterface {
  public studentTasks$: Observable<StudentTaskInterface[]>;
  public currentTask$: Observable<StudentTaskWithContentInterface>;
  public routeParams$: Observable<Params>;

  constructor(
    private store: Store<DalState>,
    private router: Router,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(SCORM_EXERCISE_SERVICE_TOKEN)
    private scormExerciseService: ScormExerciseServiceInterface,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface
  ) {
    this.setSourceStreams();
    this.setPresentationStreams();
  }

  private setSourceStreams() {
    this.routeParams$ = this.store.pipe(select(getRouterStateParams));
  }

  private setPresentationStreams() {
    this.studentTasks$ = this.store.pipe(select(studentTasks));
  }

  openTask(task: TaskInterface) {
    this.router.navigate(['tasks', task.id]);
  }

  openEduContentAsExercise(eduContent: EduContent): void {
    this.routeParams$
      .pipe(
        take(1),
        map(params => params.task)
      )
      .subscribe(taskId => {
        this.scormExerciseService.startExerciseFromTask(
          this.authService.userId,
          eduContent.id,
          taskId
        );
      });
  }
  openEduContentAsSolution(eduContent: EduContent): void {
    throw new Error(`students can't open with solution in task`);
  }
  openEduContentFromResult(result: ResultInterface): void {
    this.scormExerciseService.reviewExerciseFromResult(result);
  }
  openEduContentAsStream(eduContent: EduContent): void {
    this.openStaticContentService.open(eduContent, true);
  }
  openEduContentAsDownload(eduContent: EduContent): void {
    this.openStaticContentService.open(eduContent, false);
  }

  openBoeke(eduContent: EduContent): void {
    this.openStaticContentService.open(eduContent);
  }

  previewEduContentAsImage(eduContent: EduContent): void {
    this.openStaticContentService.open(eduContent, false, true);
  }
}
