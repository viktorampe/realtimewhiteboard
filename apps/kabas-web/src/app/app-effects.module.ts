import { NgModule } from '@angular/core';
import { UiEffects } from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [EffectsModule.forRoot([]), EffectsModule.forFeature([UiEffects])],
  exports: []
})
export class AppEffectsModule {}
