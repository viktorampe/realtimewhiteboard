import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TileSecondaryActionInterface } from '@campus/ui';
import { LearningAreaInterface } from '@diekeure/polpo-api-angular-sdk';

@Component({
  selector: 'campus-favorite-areas',
  templateUrl: './favorite-areas.component.html',
  styleUrls: ['./favorite-areas.component.scss']
})
export class FavoriteAreasComponent {
  @Input() favoriteLearningAreas: LearningAreaInterface[];
  @Output() removeAreaFromFavorites = new EventEmitter<LearningAreaInterface>();

  removeAreaFromFavoritesAction(
    learningArea: LearningAreaInterface
  ): TileSecondaryActionInterface {
    return {
      label: 'Verwijderen uit favorieten',
      icon: 'verwijder',
      onClick: () => {
        this.removeAreaFromFavorites.emit(learningArea);
      }
    };
  }
}
