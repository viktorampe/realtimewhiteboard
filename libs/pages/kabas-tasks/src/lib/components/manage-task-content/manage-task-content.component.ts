import { Component, HostBinding, OnInit } from '@angular/core';
import { SearchStateInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskEduContentWithEduContentInterface } from '../../interfaces/TaskEduContentWithEduContent.interface';
import { KabasTasksViewModel } from '../kabas-tasks.viewmodel';

@Component({
  selector: 'campus-manage-task-content',
  templateUrl: './manage-task-content.component.html',
  styleUrls: ['./manage-task-content.component.scss']
})
export class ManageTaskContentComponent implements OnInit {
  public currentContent$: Observable<TaskEduContentWithEduContentInterface[]>;

  @HostBinding('class.manage-task-content')
  manageTaskContentClass = true;

  constructor(private viewModel: KabasTasksViewModel) {}

  ngOnInit() {
    this.currentContent$ = this.viewModel.currentTask$.pipe(
      map(task => task.taskEduContents)
    );
  }

  public clickDone() {}

  addEduContentToTask(eduContentId: number, taskId: number, index: number) {
    throw new Error('not implemented');
  }

  selectTOC(tocId: number, depth: number) {
    // TODO: implement
    throw new Error('Not yet implemented');
  }

  searchEduContents(searchState: SearchStateInterface): void {
    throw new Error('not implemented');
  }

  removeEduContentFromTask(taskEduContentId: number) {
    throw new Error('not implemented');
  }
}
