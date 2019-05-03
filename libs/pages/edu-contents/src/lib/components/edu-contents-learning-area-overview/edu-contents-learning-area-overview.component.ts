import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import { EnvironmentSearchModesInterface } from '@campus/shared';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap
} from 'rxjs/operators';
import { EduContentsViewModel } from '../edu-contents.viewmodel';

@Component({
  selector: 'campus-edu-contents',
  templateUrl: './edu-contents-learning-area-overview.component.html',
  styleUrls: ['./edu-contents-learning-area-overview.component.scss']
})
export class EduContentLearningAreaOverviewComponent implements OnInit {
  public learningAreas$: Observable<LearningAreaInterface[]>;
  public favoriteLearningAreas$: Observable<LearningAreaInterface[]>;
  public searchModes: EnvironmentSearchModesInterface;
  public searchTerm$: Subject<string>;
  public autoCompleteValues$: Observable<string[]>;

  dropZoneIsHovered = false;
  favoritesDropListId = 'favorites-area';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public eduContentsViewModel: EduContentsViewModel
  ) {}

  ngOnInit(): void {
    this.learningAreas$ = this.eduContentsViewModel.learningAreas$.pipe(
      map(learningAreas => {
        return learningAreas.sort((l1, l2) => {
          if (l1.name === l2.name) return 0;
          return l1.name > l2.name ? 1 : -1;
        });
      })
    );
    this.favoriteLearningAreas$ = this.eduContentsViewModel.favoriteLearningAreas$;
    this.searchModes = this.eduContentsViewModel.searchModes;
    this.searchTerm$ = new Subject();
    this.autoCompleteValues$ = this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchTerm =>
        this.eduContentsViewModel.requestAutoComplete(searchTerm)
      )
    );
  }

  public openSearchByTerm(searchTerm: string) {
    this.router.navigate(['term'], {
      relativeTo: this.route,
      queryParams: { searchTerm }
    });
  }

  public searchTermChanged(searchTerm: string) {
    this.searchTerm$.next(searchTerm);
  }

  toggleFavorite(learningArea: LearningAreaInterface) {
    this.eduContentsViewModel.toggleFavoriteArea(learningArea);
  }

  setHoverState(state: boolean) {
    this.dropZoneIsHovered = state;
  }

  onFavoritesDropped($event: CdkDragDrop<LearningAreaInterface>) {
    this.setHoverState(false); // item is dropped, so drop area is not hovered anymore
    this.toggleFavorite($event.item.data);
  }

  onFavoriteRemoved($event: LearningAreaInterface) {
    this.toggleFavorite($event);
  }
}
