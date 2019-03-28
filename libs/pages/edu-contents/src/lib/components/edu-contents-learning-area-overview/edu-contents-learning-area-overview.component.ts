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
  dropZoneIsHovered = false;
  constructor(public viewModel: EduContentsViewModelMock) {}

  onFavoriteDrop(event: CdkDragDrop<LearningAreaInterface[]>) {
    const learningAreaToAddToFavorite = event.item.data;
    this.viewModel.toggleFavoriteArea(learningAreaToAddToFavorite);
  }

  setHoverState(state: boolean) {
    this.dropZoneIsHovered = state;
  }
}
