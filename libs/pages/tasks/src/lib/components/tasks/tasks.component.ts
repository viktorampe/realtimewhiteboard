import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { TasksViewModel } from '../tasks.viewmodel';
import {
  TasksWithInfoInterface,
  TaskWithInfoInterface
} from '../tasks.viewmodel.interfaces';
@Component({
  selector: 'campus-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  listFormat = ListFormat;
  listFormat$: Observable<ListFormat> = this.viewModel.listFormat$;

  taskInstances$: Observable<TasksWithInfoInterface>;
  learningArea$: Observable<LearningAreaInterface>;

  @ViewChild(FilterTextInputComponent, { static: true })
  filterTextInput: FilterTextInputComponent<
    TasksWithInfoInterface,
    TaskWithInfoInterface
  >;

  private routeParams$ = this.route.params.pipe(shareReplay(1));

  constructor(
    private route: ActivatedRoute,
    private viewModel: TasksViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.taskInstances$ = this.getTaskInstances();
    this.learningArea$ = this.getLearningArea();
    this.filterTextInput.setFilterableItem(this);
  }

  setListFormat(format: ListFormat) {
    this.viewModel.changeListFormat(format);
  }

  private getLearningArea(): Observable<LearningAreaInterface> {
    return this.routeParams$.pipe(
      switchMap(params => {
        return this.viewModel.getLearningAreaById(parseInt(params.area, 10));
      })
    );
  }

  private getTaskInstances(): Observable<TasksWithInfoInterface> {
    return this.routeParams$.pipe(
      map(params => parseInt(params.area, 10)),
      switchMap(areaId => {
        return this.viewModel.getTasksByLearningAreaId(areaId);
      })
    );
  }

  getIcon(finished: boolean): string {
    return finished ? 'finished' : 'unfinished';
  }

  filterFn(
    source: TasksWithInfoInterface,
    searchText: string
  ): TaskWithInfoInterface[] {
    const instances = this.filterService.filter(source.taskInfos, {
      task: { name: searchText }
    });
    return instances;
  }
}
