import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  LearningAreaInterface,
  TaskEduContentInterface,
  TaskInstanceInterface
} from '@campus/dal';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { TasksViewModel } from '../tasks.viewmodel';

@Component({
  selector: 'campus-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  //input streams
  routerParams$: Params;

  //intermediate streams
  taskEduContents$: Observable<TaskEduContentInterface[]>;

  //output streams
  learingArea$: Observable<LearningAreaInterface>;
  taskInstance$: Observable<TaskInstanceInterface>;
  filteredTaskEduContents$: Observable<TaskEduContentInterface[]>;
  selectedTaskEduContent$: Observable<TaskEduContentInterface>;

  constructor(
    private taskViewModel: TasksViewModel,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadInputParams();
    this.loadIntermediateStreams();
    this.loadOutputStreams();
  }

  private loadInputParams(): void {
    this.routerParams$ = this.activatedRoute.params.pipe(shareReplay(1));
  }

  private loadIntermediateStreams(): void {
    //TODO add
  }

  private loadOutputStreams(): void {
    this.learingArea$ = this.getLearingArea();
    this.taskInstance$ = this.getTaskInstance();
    //TODO expand
    // filteredTaskEduContents$
    // selectedTaskEduContent$
  }

  private getLearingArea(): Observable<LearningAreaInterface> {
    //TODO needs to be
    return this.taskViewModel.selectedLearningArea$;
  }

  private getTaskInstance(): Observable<TaskInstanceInterface> {
    //TODO needs to be
    return this.taskViewModel.selectedTaskInstance$;
  }
}
