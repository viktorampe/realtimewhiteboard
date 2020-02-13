import { Component, HostBinding } from '@angular/core';
import { SearchStateInterface } from '@campus/dal';

@Component({
  selector: 'campus-manage-task-content',
  templateUrl: './manage-task-content.component.html',
  styleUrls: ['./manage-task-content.component.scss']
})
export class ManageTaskContentComponent {
  @HostBinding('class.manage-task-content')
  manageTaskContentClass = true;

  constructor() {}

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
