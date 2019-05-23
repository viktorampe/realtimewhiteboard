import { InjectionToken } from '@angular/core';
import {
  EduContent,
  EduContentInterface,
  FavoriteInterface,
  HistoryInterface
} from '@campus/dal';
import { Observable } from 'rxjs';

export const EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN = new InjectionToken(
  'EduContentSearchResultItemService'
);

export interface EduContentSearchResultItemServiceInterface {
  isFavorite$(eduContentId: number): Observable<boolean>;

  linkTask(eduContent: EduContent): void;

  linkBundle(eduContent: EduContent): void;

  openStatic(eduContent: EduContent, stream: boolean): void;

  openExercise(eduContentId: number, answers: boolean): void;

  toggleFavorite(favorite: FavoriteInterface): void;

  upsertEduContentToStore(eduContent: EduContentInterface): void;
  upsertHistoryToStore(history: HistoryInterface): void;
}
