import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { FilterTextInputComponent } from '@campus/ui';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';

@Component({
  selector: 'campus-areas-list',
  templateUrl: './areas-list.component.html',
  styleUrls: ['./areas-list.component.scss']
})
export class AreasListComponent implements OnInit, OnChanges {
  @Input() learningAreas: LearningAreaInterface[];
  @Input() favoriteLearningAreas: LearningAreaInterface[];
  @Input() connectedDropList: string;

  displayedLearningAreas: LearningAreaInterface[];

  @ViewChild(FilterTextInputComponent, { static: true })
  filterTextInput: FilterTextInputComponent<
    LearningAreaInterface[],
    LearningAreaInterface
  >;

  constructor(
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface
  ) {}

  ngOnInit() {
    this.updateDisplayedLearningAreas();
    this.filterTextInput.setFilterableItem(this);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['favoriteLearningAreas']) {
      this.updateDisplayedLearningAreas();
    }
  }

  updateDisplayedLearningAreas() {
    this.displayedLearningAreas = this.learningAreas.filter(
      area => !this.isFavoriteArea(area)
    );
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
