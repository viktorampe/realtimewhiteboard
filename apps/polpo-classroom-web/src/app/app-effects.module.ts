import { NgModule } from '@angular/core';
import {
  AlertsEffects,
  BundlesEffects,
  ContentStatusesEffects,
  CredentialEffects,
  CurrentExerciseEffects,
  EduContentProductTypeEffects,
  EduContentsEffects,
  EduNetEffects,
  EffectFeedbackEffects,
  FavoriteEffects,
  HistoryEffects,
  LearningAreasEffects,
  LearningDomainEffects,
  LinkedPersonEffects,
  MethodEffects,
  ResultEffects,
  SchoolTypeEffects,
  StudentContentStatusesEffects,
  TaskEduContentEffects,
  TaskEffects,
  TaskInstanceEffects,
  TeacherStudentEffects,
  UiEffects,
  UnlockedBoekeGroupsEffects,
  UnlockedBoekeStudentsEffects,
  UnlockedContentsEffects,
  UserContentsEffects,
  UserEffects,
  YearEffects
} from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([
      EffectFeedbackEffects,
      BundlesEffects,
      UserEffects,
      EduContentsEffects,
      UiEffects,
      LearningAreasEffects,
      MethodEffects,
      UserContentsEffects,
      StudentContentStatusesEffects,
      UnlockedBoekeGroupsEffects,
      UnlockedContentsEffects,
      UnlockedBoekeStudentsEffects,
      ContentStatusesEffects,
      TaskEffects,
      TaskInstanceEffects,
      AlertsEffects,
      TaskEduContentEffects,
      ResultEffects,
      LearningDomainEffects,
      CurrentExerciseEffects,
      TeacherStudentEffects,
      LinkedPersonEffects,
      CredentialEffects,
      FavoriteEffects,
      HistoryEffects,
      EduContentProductTypeEffects,
      EduNetEffects,
      SchoolTypeEffects,
      YearEffects
    ])
  ],
  exports: []
})
export class AppEffectsModule {}
