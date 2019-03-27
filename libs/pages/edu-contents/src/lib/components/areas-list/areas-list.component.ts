import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { FilterTextInputComponent } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';

@Component({
  selector: 'campus-areas-list',
  templateUrl: './areas-list.component.html',
  styleUrls: ['./areas-list.component.scss']
})
export class AreasListComponent implements OnInit {
  @Input() learningAreas: LearningAreaInterface[];
  @Input() favoriteLearningAreas: LearningAreaInterface[];

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    LearningAreaInterface[],
    LearningAreaInterface
  >;

  constructor(
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.filterTextInput.setFilterableItem(this);
  }

  isFavoriteArea(area: LearningAreaInterface) {
    return !!this.favoriteLearningAreas.find(
      favorite => favorite.id === area.id
    );
  }

  filterFn(
    source: LearningAreaInterface[],
    searchText: string
  ): LearningAreaInterface[] {
    return this.filterService.filter(source, { name: searchText });
  }
}
