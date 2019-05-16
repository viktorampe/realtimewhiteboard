import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { TileSecondaryActionInterface } from '@campus/ui';
@Component({
  selector: 'campus-favorite-areas',
  templateUrl: './favorite-areas.component.html',
  styleUrls: ['./favorite-areas.component.scss']
})
export class FavoriteAreasComponent {
  @Input() favoriteLearningAreas: LearningAreaInterface[];
  @Input() isHovered = false;
  @Output() removeAreaFromFavorites = new EventEmitter<LearningAreaInterface>();

  removeAreaFromFavoritesAction(
    learningArea: LearningAreaInterface
  ): TileSecondaryActionInterface {
    return {
      label: 'Verwijderen uit favorieten',
      icon: 'remove',
      onClick: () => {
        this.removeAreaFromFavorites.emit(learningArea);
      }
    };
  }
}
