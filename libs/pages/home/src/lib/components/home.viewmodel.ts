import { Inject, Injectable } from '@angular/core';
import { DalState, EduContent, FavoriteTypesEnum } from '@campus/dal';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  FavoriteWithEduContent,
  getFavoritesWithEduContent
} from './home.viewmodel.selectors';

@Injectable({
  providedIn: 'root'
})
export class HomeViewModel {
  //Presentation streams
  public favoritesWithEduContent$: Observable<FavoriteWithEduContent[]>;

  constructor(
    private store: Store<DalState>,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface
  ) {
    this.initialize();
  }

  public openBoeke(eduContent: EduContent): void {
    this.openStaticContentService.open(eduContent);
  }

  private initialize() {
    this.setPresentationStreams();
  }

  private setPresentationStreams(): void {
    this.favoritesWithEduContent$ = this.store.pipe(
      select(getFavoritesWithEduContent, { type: FavoriteTypesEnum.BOEKE })
    );
  }
}
