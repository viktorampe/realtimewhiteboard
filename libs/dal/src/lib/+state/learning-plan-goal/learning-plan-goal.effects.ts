import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  LearningPlanGoalServiceInterface,
  LEARNING_PLAN_GOAL_SERVICE_TOKEN
} from '../../learning-plan-goal/learning-plan-goal.service.interface';
import {
  AddLearningPlanGoalsForBook,
  LearningPlanGoalsActionTypes,
  LearningPlanGoalsLoadError,
  LoadLearningPlanGoalsForBook
} from './learning-plan-goal.actions';
import { isBookLoaded } from './learning-plan-goal.selectors';

@Injectable()
export class LearningPlanGoalEffects {
  @Effect()
  loadLearningPlanGoalsForBook$ = this.dataPersistence.fetch(
    LearningPlanGoalsActionTypes.LoadLearningPlanGoalsForBook,
    {
      run: (action: LoadLearningPlanGoalsForBook, state: DalState) => {
        const requestedBookId = action.payload.bookId;
        const userId = action.payload.userId;

        if (isBookLoaded(state, { bookId: requestedBookId })) {
          return;
        }

        return this.learningPlanGoalService
          .getLearningPlanGoalsForBook(userId, requestedBookId)
          .pipe(
            map(
              learningPlanGoals =>
                new AddLearningPlanGoalsForBook({
                  bookId: requestedBookId,
                  learningPlanGoals
                })
            )
          );
      },
      onError: (action: LoadLearningPlanGoalsForBook, error) => {
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
