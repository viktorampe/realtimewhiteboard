import { NgModule } from '@angular/core';
import {
  AlertsEffects,
  ClassGroupEffects,
  CurrentExerciseEffects,
  DiaboloPhaseEffects,
  EduContentBookEffects,
  EduContentProductTypeEffects,
  EduContentsEffects,
  EduContentTocEduContentEffects,
  EduContentTocEffects,
  EffectFeedbackEffects,
  FavoriteEffects,
  HistoryEffects,
  LearningAreasEffects,
  LearningDomainEffects,
  LearningPlanGoalEffects,
  LearningPlanGoalProgressEffects,
  MethodEffects,
  MethodLevelEffects,
  ResultEffects,
  UiEffects,
  UnlockedFreePracticeEffects,
  UserEffects,
  UserLessonEffects,
  YearEffects
} from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';
import { TaskGroupEffects } from 'libs/dal/src/lib/+state/task-group';

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([
      UiEffects,
      UserEffects,
      EffectFeedbackEffects,
      EduContentTocEffects,
      EduContentBookEffects,
      DiaboloPhaseEffects,
      EduContentProductTypeEffects,
      MethodEffects,
      YearEffects,
      EduContentsEffects,
      CurrentExerciseEffects,
      UserLessonEffects,
      LearningAreasEffects,
      LearningDomainEffects,
      LearningPlanGoalProgressEffects,
      LearningPlanGoalEffects,
      ClassGroupEffects,
      ResultEffects,
      HistoryEffects,
      FavoriteEffects,
      AlertsEffects,
      UnlockedFreePracticeEffects,
      MethodLevelEffects,
      EduContentTocEduContentEffects,
      TaskGroupEffects
    ])
  ]
})
export class AppEffectsModule {}
