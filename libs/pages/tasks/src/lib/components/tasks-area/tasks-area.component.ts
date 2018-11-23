import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { Observable } from 'rxjs';
import {
  LearningAreasWithTaskInstanceInfoInterface,
  LearningAreaWithTaskInfoInterface
} from '../tasks.viewmodel.interfaces';
// TODO replace import
// import { TasksViewModel } from '../tasks.viewmodel';
import { MockTasksViewModel as TasksViewModel } from '../tasks.viewmodel.mock';

@Component({
  selector: 'campus-tasks-area',
  templateUrl: './tasks-area.component.html',
  styleUrls: ['./tasks-area.component.scss']
})
export class TasksAreaComponent implements OnInit {
  protected listFormat = ListFormat;
  listFormat$: Observable<ListFormat>;
  learningAreasWithInfo$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
  >;

  @ViewChild('filterInput')
  filterTextInput: FilterTextInputComponent<
    LearningAreasWithTaskInstanceInfoInterface,
    LearningAreaWithTaskInfoInterface
  >;

  constructor(
    private tasksViewModel: TasksViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.listFormat$ = this.tasksViewModel.listFormat$;
    this.learningAreasWithInfo$ = this.tasksViewModel.learningAreasWithTaskInstances$;
    this.filterTextInput.setFilterableItem(this);
  }

  clickChangeListFormat(value: ListFormat): void {
    this.tasksViewModel.changeListFormat(value);
  }

  filterFn(
    info: LearningAreasWithTaskInstanceInfoInterface,
    searchText: string
  ): LearningAreaWithTaskInfoInterface[] {
    return this.filterService.filter(info.learningAreasWithInfo, {
      learningArea: { name: searchText }
    });
  }
}
