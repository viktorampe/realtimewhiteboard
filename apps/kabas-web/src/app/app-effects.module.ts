import { NgModule } from '@angular/core';
import {
  AlertsEffects,
  ClassGroupEffects,
  CurrentExerciseEffects,
  DiaboloPhaseEffects,
  EduContentBookEffects,
  EduContentProductTypeEffects,
  EduContentsEffects,
  EduContentTocEffects,
  EffectFeedbackEffects,
  FavoriteEffects,
  HistoryEffects,
  LearningAreasEffects,
  LearningDomainEffects,
  LearningPlanGoalEffects,
  LearningPlanGoalProgressEffects,
  MethodEffects,
  UiEffects,
  UnlockedFreePracticeEffects,
  UserEffects,
  UserLessonEffects,
  YearEffects
} from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';

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
      HistoryEffects,
      FavoriteEffects,
      AlertsEffects,
      UnlockedFreePracticeEffects
    ])
  ]
})
export class AppEffectsModule {}
