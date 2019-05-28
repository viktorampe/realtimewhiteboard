import { Inject, Injectable } from '@angular/core';
import {
  DalState,
  EduContent,
  EduContentActions,
  EduContentInterface,
  FavoriteActions,
  FavoriteInterface,
  FavoriteQueries,
  HistoryActions,
  HistoryInterface,
  Permissions
} from '@campus/dal';
import {
  EduContentCollectionManagerServiceInterface,
  EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  PermissionServiceInterface,
  PERMISSION_SERVICE_TOKEN,
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { EduContentSearchResultItemServiceInterface } from './edu-content-search-result.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EduContentSearchResultItemService
  implements EduContentSearchResultItemServiceInterface {
  private hasManageHistoryPermission = this.permissionService
    .hasPermission(Permissions.settings.MANAGE_HISTORY)
    .pipe(
      take(1),
      filter(hasPermission => hasPermission)
    );

  constructor(
    @Inject(SCORM_EXERCISE_SERVICE_TOKEN)
    private scormExerciseService: ScormExerciseServiceInterface,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface,
    @Inject(EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN)
    private eduContentManagerService: EduContentCollectionManagerServiceInterface,
    private store: Store<DalState>,
    @Inject(PERMISSION_SERVICE_TOKEN)
    private permissionService: PermissionServiceInterface
  ) {}

  isFavorite$(eduContentId: number): Observable<boolean> {
    return this.store.pipe(
      select(FavoriteQueries.getIsFavoriteEduContent, {
        eduContentId
      })
    );
  }

  linkTask(eduContent: EduContent) {
    this.eduContentManagerService.manageTasksForContent(eduContent);
  }

  linkBundle(eduContent: EduContent) {
    this.eduContentManagerService.manageBundlesForContent(
      eduContent,
      eduContent.publishedEduContentMetadata.learningAreaId
    );
  }

  openStatic(eduContent: EduContent, stream: boolean) {
    this.openStaticContentService.open(eduContent, stream);
  }

  openExercise(eduContentId: number, answers: boolean) {
    this.scormExerciseService.previewExerciseFromUnlockedContent(
      null,
      eduContentId,
      null,
      answers
    );
  }

  toggleFavorite(favorite: FavoriteInterface): void {
    this.store.dispatch(new FavoriteActions.ToggleFavorite({ favorite }));
  }

  upsertEduContentToStore(eduContent: EduContentInterface): void {
    this.store.dispatch(
      new EduContentActions.UpsertEduContent({
        eduContent
      })
    );
  }

  upsertHistoryToStore(history: HistoryInterface): void {
    this.hasManageHistoryPermission.subscribe(() => {
      this.store.dispatch(new HistoryActions.StartUpsertHistory({ history }));
    });
  }
}
