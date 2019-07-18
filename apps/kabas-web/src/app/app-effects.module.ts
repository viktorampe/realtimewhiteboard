import { NgModule } from '@angular/core';
import { EduContentBookEffects, UiEffects } from '@campus/dal';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([UiEffects, EduContentBookEffects])
  ]
})
export class AppEffectsModule {}
