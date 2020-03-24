import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContent,
  getRouterState,
  ResultInterface,
  RouterStateUrl
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
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  take
} from 'rxjs/operators';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';
import { StudentTaskWithContentInterface } from '../interfaces/StudentTaskWithContent.interface';
import {
  studentTasks,
  studentTaskWithContent
} from './student-tasks.viewmodel.selectors';

export interface CurrentTaskParams {
  id?: number;
}

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

  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;
  private currentTaskParams$: Observable<CurrentTaskParams>;

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
    this.routerState$ = this.store.pipe(select(getRouterState));
  }

  private setPresentationStreams() {
    this.studentTasks$ = this.store.pipe(select(studentTasks));
    this.currentTaskParams$ = this.routerState$.pipe(
      filter(routerState => !!routerState),
      map(
        (
          routerState: RouterReducerState<RouterStateUrl>
        ): CurrentTaskParams => ({
          id: +routerState.state.params.id || undefined
        })
      ),
      distinctUntilChanged((a, b) => a.id === b.id),
      shareReplay(1)
    );

    this.currentTask$ = this.currentTaskParams$.pipe(
      filter(params => !!params.id),
      switchMap(params => {
        return this.store.pipe(
          select(studentTaskWithContent, { id: params.id })
        );
      })
    );
  }

  openTask(prop: { taskInstanceId: number }) {
    this.router.navigate(['tasks', prop.taskInstanceId]);
  }

  openEduContentAsExercise(eduContent: EduContent): void {
    this.currentTaskParams$
      .pipe(
        take(1),
        map(params => params.id)
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
