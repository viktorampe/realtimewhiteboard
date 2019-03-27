import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'campus-areas-list',
  templateUrl: './areas-list.component.html',
  styleUrls: ['./areas-list.component.scss']
})
export class AreasListComponent implements OnInit {
  @Input() learningAreas: LearningAreaInterface[];
  @Input() favoriteLearningAreas: LearningAreaInterface[];

  isSmallScreen$: Observable<boolean>;
  isMediumScreen$: Observable<boolean>;
  filteredLearningAreas: LearningAreaInterface[];
  filter = '';

  constructor(private breakPointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.filteredLearningAreas = this.learningAreas;
    this.loadOutputStreams();
  }

  private loadOutputStreams() {
    this.isSmallScreen$ = this.breakPointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(map(result => !result.matches));
    this.isMediumScreen$ = this.breakPointObserver
      .observe([Breakpoints.Small, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(map(result => !result.matches));
  }

  isFavoriteArea(area: LearningAreaInterface) {
    return !!this.favoriteLearningAreas.find(
      favorite => favorite.id === area.id
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
}
