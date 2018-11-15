import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { Observable } from 'rxjs';
import { TasksViewModel } from '../tasks.viewmodel';
import { TaskInstancesWithEduContentInfoInterface } from '../tasks.viewmodel.interfaces';

@Component({
  selector: 'campus-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  listFormat$: Observable<ListFormat> = this.viewModel.listFormat$;

  taskInstances$: Observable<TaskInstancesWithEduContentInfoInterface> = this
    .viewModel.taskInstancesByLearningArea$;

  learningArea$: Observable<LearningAreaInterface> = this.viewModel
    .selectedLearningArea$;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    TaskInstancesWithEduContentInfoInterface,
    TaskInstancesWithEduContentInfoInterface
  >;

  constructor(
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
    source: TaskInstancesWithEduContentInfoInterface,
    searchText: string
  ): TaskInstancesWithEduContentInfoInterface {
    const instances = this.filterService.filter(source.instances, {
      taskInstance: {
        task: { name: searchText }
      }
    });
    return { instances };
  }

  getIcon(finished: boolean): string {
    return finished ? 'icon-checkmark' : 'icon-hourglass';
  }
}
