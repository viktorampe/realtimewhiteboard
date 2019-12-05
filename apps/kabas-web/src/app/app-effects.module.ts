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
  LinkedPersonEffects,
  MethodEffects,
  MethodLevelEffects,
  ResultEffects,
  TaskGroupEffects,
  TaskStudentEffects,
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
      ResultEffects,
      HistoryEffects,
      FavoriteEffects,
      AlertsEffects,
      UnlockedFreePracticeEffects,
      MethodLevelEffects,
      EduContentTocEduContentEffects,
      TaskGroupEffects,
      LinkedPersonEffects,
      TaskStudentEffects
    ])
  ]
})
export class AppEffectsModule {}
