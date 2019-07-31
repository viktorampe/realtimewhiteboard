import { NgModule } from '@angular/core';
import {
  CurrentExerciseEffects,
  DiaboloPhaseEffects,
  EduContentBookEffects,
  EduContentProductTypeEffects,
  EduContentsEffects,
  EduContentTocEffects,
  LearningDomainEffects,
  MethodEffects,
  UiEffects,
  UserEffects,
  YearEffects
} from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([
      UiEffects,
      UserEffects,
      EduContentTocEffects,
      EduContentBookEffects,
      DiaboloPhaseEffects,
      EduContentProductTypeEffects,
      MethodEffects,
      YearEffects,
      EduContentsEffects,
      CurrentExerciseEffects,
      LearningDomainEffects
    ])
  ]
})
export class AppEffectsModule {}
