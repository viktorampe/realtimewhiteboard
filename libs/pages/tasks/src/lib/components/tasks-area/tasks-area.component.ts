import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Observable } from 'rxjs';
import { TasksViewModel } from '../tasks.viewmodel';
import {
  LearningAreasWithTaskInfoInterface,
  LearningAreaWithTaskInfoInterface
} from '../tasks.viewmodel.interfaces';

@Component({
  selector: 'campus-tasks-area',
  templateUrl: './tasks-area.component.html',
  styleUrls: ['./tasks-area.component.scss']
})
export class TasksAreaComponent implements OnInit {
  listFormat = ListFormat;
  listFormat$: Observable<ListFormat>;
  learningAreasWithInfo$: Observable<LearningAreasWithTaskInfoInterface>;

  @ViewChild('filterInput', { static: true })
  filterTextInput: FilterTextInputComponent<
    LearningAreasWithTaskInfoInterface,
    LearningAreaWithTaskInfoInterface
  >;

  constructor(
    private tasksViewModel: TasksViewModel,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.listFormat$ = this.tasksViewModel.listFormat$;
    this.learningAreasWithInfo$ = this.tasksViewModel.learningAreasWithTaskInfo$;
    this.filterTextInput.setFilterableItem(this);
  }

  clickChangeListFormat(value: ListFormat): void {
    this.tasksViewModel.changeListFormat(value);
  }

  filterFn(
    info: LearningAreasWithTaskInfoInterface,
    searchText: string
  ): LearningAreaWithTaskInfoInterface[] {
    return this.filterService.filter(info.learningAreasWithInfo, {
      learningArea: { name: searchText }
    });
  }
}
