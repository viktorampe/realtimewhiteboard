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
  favoritesDropListId = 'favorites-area';
  constructor(public viewModel: EduContentsViewModelMock) {}

  toggleFavorite(learningArea: LearningAreaInterface) {
    this.viewModel.toggleFavoriteArea(learningArea);
  }

  setHoverState(state: boolean) {
    this.dropZoneIsHovered = state;
  }

  onFavoritesDropped($event: CdkDragDrop<LearningAreaInterface>) {
    this.setHoverState(false); // item is dropped, so drop area is not hovered anymore
    this.toggleFavorite($event.item.data);
  }
}
