import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { combineLatest, from, Observable } from 'rxjs';
import { map, mapTo, switchMap, take } from 'rxjs/operators';
import { DalState } from '..';
import { LearningPlanGoalProgressInterface } from '../../+models';
import {
  LearningPlanGoalProgressServiceInterface,
  LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
} from '../../learning-plan-goal-progress';
import { UndoServiceInterface, UNDO_SERVICE_TOKEN } from '../../undo';
import { EffectFeedback, EffectFeedbackActions } from '../effect-feedback';
import {
  AddLearningPlanGoalProgresses,
  BulkAddLearningPlanGoalProgresses,
  DeleteLearningPlanGoalProgress,
  DeleteLearningPlanGoalProgresses,
  LearningPlanGoalProgressesActionTypes,
  LearningPlanGoalProgressesLoaded,
  LearningPlanGoalProgressesLoadError,
  LoadLearningPlanGoalProgresses,
  StartAddLearningPlanGoalProgresses,
  ToggleLearningPlanGoalProgress
} from './learning-plan-goal-progress.actions';
import { findOne } from './learning-plan-goal-progress.selectors';

@Injectable()
export class LearningPlanGoalProgressEffects {
  @Effect()
  loadLearningPlanGoalProgresses$ = this.dataPersistence.fetch(
    LearningPlanGoalProgressesActionTypes.LoadLearningPlanGoalProgresses,
    {
      run: (action: LoadLearningPlanGoalProgresses, state: DalState) => {
        if (!action.payload.force && state.learningPlanGoalProgresses.loaded)
          return;
        return this.learningPlanGoalProgressService
          .getAllForUser(action.payload.userId)
          .pipe(
            map(
              (
                learningPlanGoalProgresses: LearningPlanGoalProgressInterface[]
              ) =>
                new LearningPlanGoalProgressesLoaded({
                  learningPlanGoalProgresses
                })
            )
          );
      },
      onError: (action: LoadLearningPlanGoalProgresses, error) => {
        return new LearningPlanGoalProgressesLoadError(error);
      }
    }
  );

  @Effect()
  toggleLearningPlanGoalProgress$ = this.dataPersistence.actions.pipe(
    ofType(
      LearningPlanGoalProgressesActionTypes.ToggleLearningPlanGoalProgress
    ),
    switchMap(
      (
        action: ToggleLearningPlanGoalProgress
      ): Observable<
        StartAddLearningPlanGoalProgresses | DeleteLearningPlanGoalProgress
      > => {
        const { personId, ...selectParams } = action.payload;

        return this.dataPersistence.store.pipe(
          select(findOne, selectParams),
          take(1),
          map(learningPlanGoalProgress => {
            if (learningPlanGoalProgress) {
              return new DeleteLearningPlanGoalProgress({
                id: learningPlanGoalProgress.id,
                userId: action.payload.personId
              });
            } else {
              return new StartAddLearningPlanGoalProgresses({
                classGroupId: action.payload.classGroupId,
                eduContentTOCId: action.payload.eduContentTOCId,
                userLessonId: action.payload.userLessonId,
                eduContentBookId: action.payload.eduContentBookId,
                learningPlanGoalIds: [action.payload.learningPlanGoalId],
                personId: action.payload.personId
              });
            }
          })
        );
      }
    )
  );

  @Effect()
  startAddLearningPlanGoalProgresses$ = this.dataPersistence.pessimisticUpdate(
    LearningPlanGoalProgressesActionTypes.StartAddLearningPlanGoalProgresses,
    {
      run: (action: StartAddLearningPlanGoalProgresses, state: DalState) => {
        let serviceCall: Observable<LearningPlanGoalProgressInterface[]>;
        if (
          (action.payload.eduContentTOCId || action.payload.userLessonId) &&
          !(action.payload.eduContentTOCId && action.payload.userLessonId)
        ) {
          serviceCall = this.learningPlanGoalProgressService.createLearningPlanGoalProgress(
            action.payload.personId,
            action.payload.classGroupId,
            action.payload.learningPlanGoalIds,
            action.payload.eduContentBookId,
            action.payload.userLessonId,
            action.payload.eduContentTOCId
          );
        } else {
          throw new Error('Fill in either eduContentTOCId or userLessonId.');
        }

        return serviceCall.pipe(
          map(
            learningPlanGoalProgressArray =>
              new AddLearningPlanGoalProgresses({
                learningPlanGoalProgresses: learningPlanGoalProgressArray
              })
          )
        );
      },
      onError: (action: StartAddLearningPlanGoalProgresses, error) => {
        const effectFeedback = EffectFeedback.generateErrorFeedback(
          this.uuid(),
          action,
          'Het is niet gelukt om de status van het leerplandoel aan te passen.'
        );
        const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
          { effectFeedback }
        );
        return effectFeedbackAction;
      }
    }
  );

  @Effect()
  deleteLearningPlanGoalProgress$ = this.dataPersistence.optimisticUpdate(
    LearningPlanGoalProgressesActionTypes.DeleteLearningPlanGoalProgress,
    {
      run: (action: DeleteLearningPlanGoalProgress, state: DalState) => {
        return this.learningPlanGoalProgressService
          .deleteLearningPlanGoalProgress(
            action.payload.userId,
            action.payload.id
          )
          .pipe(
            mapTo(
              new EffectFeedbackActions.AddEffectFeedback({
                effectFeedback: EffectFeedback.generateSuccessFeedback(
                  this.uuid(),
                  action,
                  'Leerplandoelvoortgang verwijderd.'
                )
              })
            )
          );
      },
      undoAction: (action: DeleteLearningPlanGoalProgress, error) => {
        const undoAction = undo(action);
        const effectFeedback = EffectFeedback.generateErrorFeedback(
          this.uuid(),
          action,
          'Het is niet gelukt om de status van het leerplandoel aan te passen.'
        );
        const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
          { effectFeedback }
        );
        return from([undoAction, effectFeedbackAction]);
      }
    }
  );

  @Effect()
  deleteLearningPlanGoalProgresses$ = this.dataPersistence.optimisticUpdate(
    LearningPlanGoalProgressesActionTypes.DeleteLearningPlanGoalProgresses,
    {
      run: (action: DeleteLearningPlanGoalProgresses, state: DalState) => {
        return this.undoService.dispatchActionAsUndoable({
          action: action,
          dataPersistence: this.dataPersistence,
          intendedSideEffect: this.learningPlanGoalProgressService.deleteLearningPlanGoalProgresses(
            action.payload.userId,
            action.payload.ids
          ),
          undoLabel: 'Leerplandoel voortgangen worden verwijderd.',
          undoneLabel: 'Leerplandoel voortgangen zijn niet verwijderd.',
          doneLabel: 'Leerplandoel voortgangen zijn verwijderd.'
        });
      },
      undoAction: (action: DeleteLearningPlanGoalProgresses, error) => {
        const undoAction = undo(action);
        const effectFeedback = EffectFeedback.generateErrorFeedback(
          this.uuid(),
          action,
          'Het is niet gelukt om de status van het leerplandoelen aan te passen.'
        );
        const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
          { effectFeedback }
        );
        return from([undoAction, effectFeedbackAction]);
      }
    }
  );

  @Effect()
  bulkAddLearningPlanGoalProgress$ = this.dataPersistence.actions.pipe(
    ofType(
      LearningPlanGoalProgressesActionTypes.BulkAddLearningPlanGoalProgresses
    ),
    switchMap(
      (
        action: BulkAddLearningPlanGoalProgresses
      ): Observable<StartAddLearningPlanGoalProgresses> => {
        const {
          learningPlanGoalIds,
          personId,
          ...selectParams
        } = action.payload;

        const selectStreams = learningPlanGoalIds.map(learningPlanGoalId =>
          this.dataPersistence.store.pipe(
            select(findOne, { ...selectParams, learningPlanGoalId })
          )
        );

        return combineLatest(selectStreams).pipe(
          take(1),
          map(results => {
            const neededLearningPlanGoalIds = results.reduce(
              (acc, currentResult, index) => {
                if (!currentResult) {
                  acc.push(learningPlanGoalIds[index]);
                }
                return acc;
              },
              [] as number[]
            );

            return new StartAddLearningPlanGoalProgresses({
              classGroupId: action.payload.classGroupId,
              personId: action.payload.personId,
              eduContentTOCId: action.payload.eduContentTOCId,
              eduContentBookId: action.payload.eduContentBookId,
              userLessonId: action.payload.userLessonId,
              learningPlanGoalIds: neededLearningPlanGoalIds
            });
          })
        );
      }
    )
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN)
    private learningPlanGoalProgressService: LearningPlanGoalProgressServiceInterface,
    @Inject(UNDO_SERVICE_TOKEN) private undoService: UndoServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
