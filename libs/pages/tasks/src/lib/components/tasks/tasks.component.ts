import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { TasksViewModel } from '../tasks.viewmodel';
import { TaskInstanceWithEduContentInfoInterface } from '../tasks.viewmodel.interfaces';

@Component({
  selector: 'campus-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  listFormat$: Observable<ListFormat> = this.viewModel.listFormat$;

  taskInstances$: Observable<TaskInstanceWithEduContentInfoInterface> = this
    .viewModel.taskInstancesByLearningArea$;

  learningArea$: Observable<LearningAreaInterface> = this.viewModel
    .selectedLearningArea$;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    TaskInstanceWithEduContentInfoInterface,
    TaskInstanceWithEduContentInfoInterface[]
  >;

  private routeParams$ = this.route.params.pipe(shareReplay(1));

  constructor(
    private route: ActivatedRoute,
    private viewModel: TasksViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.filterTextInput.filterFn = this.filterFn.bind(this);
  }

  setListFormat(format: ListFormat) {
    this.viewModel.changeListFormat(format);
  }

  filterFn(
    source: TaskInstanceWithEduContentInfoInterface,
    searchText: string
  ): TaskInstanceWithEduContentInfoInterface[] {
    const instances = this.filterService.filter(source.instances, {
      taskInstance: {
        task: { name: searchText }
      }
    });
    return instances;
  }

  getTaskInstances(): Observable<TaskInstanceWithEduContentInfoInterface> {
    /*taskInstances$: Observable<TaskInstanceWithEduContentInfoInterface> = this
    .viewModel.taskInstancesByLearningArea$;*/

    return this.routeParams$.pipe(
      map(params => params.area),
      switchMap(areaId => {
        return this.viewModel.taskInstancesByLearningArea(areaId);
      })
    );
    return null;
  }

  getIcon(finished: boolean): string {
    return finished ? 'icon-checkmark' : 'icon-hourglass';
  }
}
