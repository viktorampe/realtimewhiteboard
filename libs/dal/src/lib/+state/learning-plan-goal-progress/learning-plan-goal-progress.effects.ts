import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { DataPersistence } from '@nrwl/nx';
import { undo } from 'ngrx-undo';
import { from, Observable } from 'rxjs';
import { map, mapTo, switchMap, take } from 'rxjs/operators';
import { DalActions, DalState } from '..';
import { LearningPlanGoalProgressInterface } from '../../+models';
import {
  LearningPlanGoalProgressServiceInterface,
  LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN
} from '../../learning-plan-goal-progress';
import { EffectFeedback, EffectFeedbackActions } from '../effect-feedback';
import {
  AddLearningPlanGoalProgress,
  DeleteLearningPlanGoalProgress,
  LearningPlanGoalProgressesActionTypes,
  LearningPlanGoalProgressesLoaded,
  LearningPlanGoalProgressesLoadError,
  LoadLearningPlanGoalProgresses,
  StartAddLearningPlanGoalProgress,
  ToggleLearningPlanGoalProgress
} from './learning-plan-goal-progress.actions';
import { getByRelationIds } from './learning-plan-goal-progress.selectors';

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
        StartAddLearningPlanGoalProgress | DeleteLearningPlanGoalProgress
      > => {
        const selectParams = {
          classGroupId: action.payload.classGroupId,
          personId: action.payload.personId,
          eduContentTOCId: action.payload.eduContentTOCId,
          userLessonId: action.payload.userLessonId,
          learningPlanGoalIds: [action.payload.learningPlanGoalId]
        };

        return this.dataPersistence.store.pipe(
          select(getByRelationIds, selectParams),
          take(1),
          map(learingPlanGoalProgressArray => {
            if (learingPlanGoalProgressArray) {
              return new DeleteLearningPlanGoalProgress({
                id: learingPlanGoalProgressArray[0].id,
                userId: action.payload.personId
              });
            } else {
              return new StartAddLearningPlanGoalProgress({
                learningPlanGoalProgress: action.payload,
                userId: action.payload.personId
              });
            }
          })
        );
      }
    )
  );

  @Effect()
  startAddLearningPlanGoalProgress$ = this.dataPersistence.pessimisticUpdate(
    LearningPlanGoalProgressesActionTypes.StartAddLearningPlanGoalProgress,
    {
      run: (action: StartAddLearningPlanGoalProgress, state: DalState) => {
        const learningPlanGoalProgress =
          action.payload.learningPlanGoalProgress;

        let serviceCall: Observable<LearningPlanGoalProgressInterface[]>;
        if (learningPlanGoalProgress.eduContentTOCId) {
          serviceCall = this.learningPlanGoalProgressService.createLearningPlanGoalProgressForEduContentTOC(
            learningPlanGoalProgress.personId,
            learningPlanGoalProgress.classGroupId,
            learningPlanGoalProgress.eduContentTOCId,
            [learningPlanGoalProgress.learningPlanGoalId]
          );
        } else {
          serviceCall = this.learningPlanGoalProgressService.createLearningPlanGoalProgressForUserLesson(
            learningPlanGoalProgress.personId,
            learningPlanGoalProgress.classGroupId,
            learningPlanGoalProgress.userLessonId,
            [learningPlanGoalProgress.learningPlanGoalId]
          );
        }

        return serviceCall.pipe(
          map(
            learingPlanProgressArray =>
              new AddLearningPlanGoalProgress({
                learningPlanGoalProgress: learingPlanProgressArray[0]
              })
          )
        );
      },
      onError: (action: StartAddLearningPlanGoalProgress, error) => {
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
              new DalActions.ActionSuccessful({
                successfulAction: 'LearningPlanGoalProgress deleted.'
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

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN)
    private learningPlanGoalProgressService: LearningPlanGoalProgressServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
