import { NgModule } from '@angular/core';
import {
  DiaboloPhaseEffects,
  EduContentBookEffects,
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
      EduContentBookEffects,
      EduContentTocEffects,
      DiaboloPhaseEffects
    ])
  ]
})
export class AppEffectsModule {}
