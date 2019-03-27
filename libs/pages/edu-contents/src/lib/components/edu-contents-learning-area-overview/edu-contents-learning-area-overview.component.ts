import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { EduContentsViewModelMock } from '../edu-contents.viewmodel.mock';

@Component({
  selector: 'campus-edu-contents',
  templateUrl: './edu-contents-learning-area-overview.component.html',
  styleUrls: ['./edu-contents-learning-area-overview.component.scss']
})
export class EduContentLearningAreaOverviewComponent {
  dragStarted = false;
  dropZoneIsHovered = false;
  constructor(public viewModel: EduContentsViewModelMock) {}

  changeDragStatus(started: boolean) {
    this.dragStarted = started;
  }

  onFavoriteDrop(event: CdkDragDrop<LearningAreaInterface[]>) {
    const learningAreaToAddToFavorite = event.item.data;
    console.log(learningAreaToAddToFavorite);
    this.viewModel.toggleFavoriteArea(learningAreaToAddToFavorite);
  }

  setHoverState(state: boolean) {
    console.log(state);

    this.dropZoneIsHovered = state;
  }

  onDragEnter(event: DragEvent) {
    console.log('drag enter', event);
  }
}
