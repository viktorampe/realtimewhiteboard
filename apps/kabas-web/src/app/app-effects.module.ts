import { NgModule } from '@angular/core';
import {
  DiaboloPhaseEffects,
  EduContentBookEffects,
  EduContentProductTypeEffects,
  EduContentsEffects,
  EduContentTocEffects,
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
      EduContentsEffects
    ])
  ]
})
export class AppEffectsModule {}
