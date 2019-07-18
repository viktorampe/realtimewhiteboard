import { NgModule } from '@angular/core';
import { EduContentTocEffects, UiEffects, UserEffects } from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([UiEffects]),
    EffectsModule.forFeature([UserEffects]),
    EffectsModule.forFeature([EduContentTocEffects])
  ]
})
export class AppEffectsModule {}
