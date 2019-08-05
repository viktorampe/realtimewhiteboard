import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { LearningPlanGoalServiceInterface, LEARNING_PLAN_GOAL_SERVICE_TOKEN } from '../../learning-plan-goal/learning-plan-goal.service.interface';
import {
  LearningPlanGoalsActionTypes,
  LearningPlanGoalsLoadError,
  LoadLearningPlanGoals,
  LearningPlanGoalsLoaded
} from './learning-plan-goal.actions';
import { DalState } from '..';

@Injectable()
export class LearningPlanGoalEffects {
  @Effect()
  loadLearningPlanGoals$ = this.dataPersistence.fetch(
    LearningPlanGoalsActionTypes.LoadLearningPlanGoals,
    {
      run: (action: LoadLearningPlanGoals, state: DalState) => {
        if (!action.payload.force && state.learningPlanGoals.loaded) return;
        return this.learningPlanGoalService
          .getAllForUser(action.payload.userId)
          .pipe(map(learningPlanGoals => new LearningPlanGoalsLoaded({ learningPlanGoals })));
      },
      onError: (action: LoadLearningPlanGoals, error) => {
        return new LearningPlanGoalsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(LEARNING_PLAN_GOAL_SERVICE_TOKEN)
    private learningPlanGoalService: LearningPlanGoalServiceInterface
  ) {}
}
