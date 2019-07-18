import { NgModule } from '@angular/core';
import { DiaboloPhaseEffects, UiEffects } from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([UiEffects, DiaboloPhaseEffects])
  ]
})
export class AppEffectsModule {}
