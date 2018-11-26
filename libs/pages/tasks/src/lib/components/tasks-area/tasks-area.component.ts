import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/dal';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { Observable } from 'rxjs';
import { TasksViewModel } from './../tasks.viewmodel';
import {
  LearningAreasWithTaskInstanceInfoInterface,
  LearningAreaWithTaskInfoInterface
} from './../tasks.viewmodel.interfaces';

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
    @Inject(SCORM_EXERCISE_SERVICE_TOKEN)
    private exerciseService: ScormExerciseServiceInterface,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  startEx() {
    this.exerciseService.startExerciseAsPreviewWithAnswers();
  }

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
