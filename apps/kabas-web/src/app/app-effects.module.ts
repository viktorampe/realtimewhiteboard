import { NgModule } from '@angular/core';
import {
  DiaboloPhaseEffects,
  EduContentProductTypeEffects,
  EduContentTocEffects,
  UiEffects,
  UserEffects
} from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([
      UiEffects,
      UserEffects,
      EduContentTocEffects,
      DiaboloPhaseEffects,
      EduContentProductTypeEffects
    ])
  ]
})
export class AppEffectsModule {}
