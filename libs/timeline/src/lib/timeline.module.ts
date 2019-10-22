import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import { EditorTimelineComponent } from './components/editor-timeline/editor-timeline.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SlideDetailComponent } from './components/slide-detail/slide-detail.component';
import { SlideListComponent } from './components/slide-list/slide-list.component';
import {
  EditorHttpService,
  EDITOR_HTTP_SERVICE_TOKEN
} from './services/editor-http.service';

export const ENVIRONMENT_ICON_MAPPING_TOKEN = new InjectionToken(
  'EnvironmentIconMapping'
);

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatStepperModule,
    MatIconModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  declarations: [
    EditorTimelineComponent,
    SlideListComponent,
    SlideDetailComponent,
    SettingsComponent
  ],
  exports: [EditorTimelineComponent],
  providers: [
    { provide: EDITOR_HTTP_SERVICE_TOKEN, useClass: EditorHttpService },
    { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },

    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class TimelineModule {
  constructor() {}
}
