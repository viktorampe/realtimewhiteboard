import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  UnlockedContentServiceInterface,
  UNLOCKED_CONTENT_SERVICE_TOKEN
} from '../../bundle/unlocked-content.service.interface';
import { EffectFeedback, Priority } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  DeleteUnlockedContent,
  DeleteUnlockedContents,
  LoadUnlockedContents,
  UnlockedContentsActionTypes,
  UnlockedContentsLoaded,
  UnlockedContentsLoadError
} from './unlocked-content.actions';

@Injectable()
export class UnlockedContentsEffects {
  @Effect()
  loadUnlockedContents$ = this.dataPersistence.fetch(
    UnlockedContentsActionTypes.LoadUnlockedContents,
    {
      run: (action: LoadUnlockedContents, state: DalState) => {
        if (!action.payload.force && state.unlockedContents.loaded) return;
        return this.unlockedContentService
          .getAllForUser(action.payload.userId)
          .pipe(
            map(
              unlockedContents =>
                new UnlockedContentsLoaded({ unlockedContents })
            )
          );
      },
      onError: (action: LoadUnlockedContents, error) => {
        return new UnlockedContentsLoadError(error);
      }
    }
  );

  @Effect()
  deleteUnlockedContent$ = this.dataPersistence.optimisticUpdate(
    UnlockedContentsActionTypes.DeleteUnlockedContent,
    {
      run: (action: DeleteUnlockedContent, state: any) => {
        return this.unlockedContentService.remove(action.payload.id).pipe(
          map(
            res =>
              new AddEffectFeedback({
                effectFeedback: new EffectFeedback({
                  id: this.uuid(),
                  triggerAction: action,
                  message: 'Het lesmateriaal is uit de bundel verwijderd.',
                  display: action.payload.displayResponse,
                  userActions: null,
                  type: 'success',
                  priority: Priority.NORM
                })
              })
          )
        );
      },
      undoAction: (action: DeleteUnlockedContent, error: any) => {
        const undoAction = undo(action);

        const feedbackAction = new AddEffectFeedback({
          effectFeedback: new EffectFeedback({
            id: this.uuid(),
            triggerAction: action,
            message:
              'Het is niet gelukt om het lesmateriaal uit de bundel te verwijderen.',
            display: action.payload.displayResponse,
            userActions: [{ title: 'Opnieuw', userAction: action }],
            type: 'error',
            priority: Priority.HIGH
          })
        });

        return from<Action[]>([undoAction, feedbackAction]);
      }
    }
  );

  @Effect()
  deleteUnlockedContents$ = this.dataPersistence.optimisticUpdate(
    UnlockedContentsActionTypes.DeleteUnlockedContents,
    {
      run: (action: DeleteUnlockedContents, state: any) => {
        return this.unlockedContentService.removeAll(action.payload.ids).pipe(
          map(
            res =>
              new AddEffectFeedback({
                effectFeedback: new EffectFeedback({
                  id: this.uuid(),
                  triggerAction: action,
                  message: 'De lesmaterialen zijn uit de bundel verwijderd.',
                  display: action.payload.displayResponse,
                  userActions: null,
                  type: 'success',
                  priority: Priority.NORM
                })
              })
          )
        );
      },
      undoAction: (action: DeleteUnlockedContents, error: any) => {
        const undoAction = undo(action);

        const feedbackAction = new AddEffectFeedback({
          effectFeedback: new EffectFeedback({
            id: this.uuid(),
            triggerAction: action,
            message:
              'Het is niet gelukt om de lesmaterialen uit de bundel te verwijderen.',
            display: action.payload.displayResponse,
            userActions: [{ title: 'Opnieuw', userAction: action }],
            type: 'error',
            priority: Priority.HIGH
          })
        });

        return from<Action[]>([undoAction, feedbackAction]);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(UNLOCKED_CONTENT_SERVICE_TOKEN)
    private unlockedContentService: UnlockedContentServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
