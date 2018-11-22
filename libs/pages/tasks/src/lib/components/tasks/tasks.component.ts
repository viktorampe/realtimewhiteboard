import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import {
  TaskInstancesWithEduContentInfoInterface,
  TaskInstanceWithEduContentInfoInterface
} from '../tasks.viewmodel.interfaces';
import { MockTasksViewModel } from '../tasks.viewmodel.mock';

@Component({
  selector: 'campus-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  listFormat$: Observable<ListFormat> = this.viewModel.listFormat$;

  taskInstances$: Observable<TaskInstancesWithEduContentInfoInterface>;
  learningArea$: Observable<LearningAreaInterface>;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    TaskInstancesWithEduContentInfoInterface,
    TaskInstanceWithEduContentInfoInterface
  >;

  private routeParams$ = this.route.params.pipe(shareReplay(1));

  constructor(
    private route: ActivatedRoute,
    private viewModel: MockTasksViewModel,
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
        return this.viewModel.getLearningAreaById(params.area);
      })
    );
  }

  private getTaskInstances(): Observable<
    TaskInstancesWithEduContentInfoInterface
  > {
    return this.routeParams$.pipe(
      map(params => params.area),
      switchMap(areaId => {
        return this.viewModel.taskInstancesByLearningArea(areaId);
      })
    );
  }

  getIcon(finished: boolean): string {
    return finished ? 'icon-checkmark' : 'icon-hourglass';
  }

  filterFn(
    source: TaskInstancesWithEduContentInfoInterface,
    searchText: string
  ): TaskInstanceWithEduContentInfoInterface[] {
    const instances = this.filterService.filter(source.instances, {
      taskInstance: {
        task: { name: searchText }
      }
    });
    return instances;
  }
}
