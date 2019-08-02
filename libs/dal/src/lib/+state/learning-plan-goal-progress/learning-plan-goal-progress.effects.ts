import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { LearningPlanGoalProgressServiceInterface, LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN } from '../../learning-plan-goal-progress/learning-plan-goal-progress.service.interface';
import {
  LearningPlanGoalProgressesActionTypes,
  LearningPlanGoalProgressesLoadError,
  LoadLearningPlanGoalProgresses,
  LearningPlanGoalProgressesLoaded
} from './learning-plan-goal-progress.actions';
import { DalState } from '..';

@Injectable()
export class LearningPlanGoalProgressEffects {
  @Effect()
  loadLearningPlanGoalProgresses$ = this.dataPersistence.fetch(
    LearningPlanGoalProgressesActionTypes.LoadLearningPlanGoalProgresses,
    {
      run: (action: LoadLearningPlanGoalProgresses, state: DalState) => {
        if (!action.payload.force && state.learningPlanGoalProgresses.loaded) return;
        return this.learningPlanGoalProgressService
          .getAllForUser(action.payload.userId)
          .pipe(map(learningPlanGoalProgresses => new LearningPlanGoalProgressesLoaded({ learningPlanGoalProgresses })));
      },
      onError: (action: LoadLearningPlanGoalProgresses, error) => {
        return new LearningPlanGoalProgressesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN)
    private learningPlanGoalProgressService: LearningPlanGoalProgressServiceInterface
  ) {}
}
