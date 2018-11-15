import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { TasksViewModel } from './../tasks.viewmodel';
import {
  LearningAreasWithTaskInstanceInfoInterface,
  LearningAreaWithTaskInfo
} from './../tasks.viewmodel.interfaces';

@Component({
  selector: 'campus-tasks-area',
  templateUrl: './tasks-area.component.html',
  styleUrls: ['./tasks-area.component.scss']
})
export class TasksAreaComponent implements OnInit {
  protected listFormat = ListFormat;
  filterInput$ = new BehaviorSubject<string>('');
  listFormat$: Observable<ListFormat>;
  learningAreasWithInfo$: Observable<
    LearningAreasWithTaskInstanceInfoInterface
  >;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    LearningAreasWithTaskInstanceInfoInterface,
    LearningAreaWithTaskInfo
  >;

  constructor(
    private tasksViewModel: TasksViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.listFormat$ = this.tasksViewModel.listFormat$;
    this.learningAreasWithInfo$ = this.tasksViewModel.learningAreasWithTaskInstances$;
    this.filterTextInput.filterFn = this.filterFn.bind(this);
  }

  clickChangeListFormat(value: ListFormat): void {
    this.tasksViewModel.changeListFormat(value);
  }

  private filterFn(
    info: LearningAreasWithTaskInstanceInfoInterface,
    searchText: string
  ): LearningAreaWithTaskInfo[] {
    return this.filterService.filter(info.learningAreasWithInfo, {
      learningArea: { name: searchText }
    });
  }
}
