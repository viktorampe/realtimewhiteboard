import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';

@Component({
  selector: 'campus-areas-list',
  templateUrl: './areas-list.component.html',
  styleUrls: ['./areas-list.component.scss']
})
export class AreasListComponent implements OnInit {
  @Input() learningAreas: LearningAreaInterface[];
  @Input() favoriteLearningAreas: LearningAreaInterface[];
  @Output() dropAreaOnFavorites = new EventEmitter<LearningAreaInterface>();

  filteredLearningAreas: LearningAreaInterface[];
  filter: string = '';

  ngOnInit() {
    this.filteredLearningAreas = this.learningAreas;
  }

  isFavoriteArea(area: LearningAreaInterface) {
    return (
      this.favoriteLearningAreas.find(favorite => favorite.id === area.id) !=
      null
    );
  }

  onFilterChange(event: any) {
    if (this.filter.trim().length > 0) {
      const filter = this.filter.trim().toLowerCase();

      this.filteredLearningAreas = this.learningAreas.filter(area =>
        area.name.toLowerCase().includes(filter)
      );
    } else {
      this.filteredLearningAreas = this.learningAreas;
    }
  }

  onLearningAreaDrop(event: CdkDragDrop<LearningAreaInterface[]>) {
    // only emit event when the learning area is dropped above the favorites container
    if (event.container === event.previousContainer) return;
    const learningAreaToAddToFavorite = event.item.data;
    this.dropAreaOnFavorites.emit(learningAreaToAddToFavorite);
  }
}
