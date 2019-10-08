import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatRadioModule
} from '@angular/material';
import { EditorTimelineComponent } from './components/editor-timeline/editor-timeline.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SlideDetailComponent } from './components/slide-detail/slide-detail.component';
import { SlideListComponent } from './components/slide-list/slide-list.component';
import {
  EditorHttpService,
  EDITOR_HTTP_SERVICE_TOKEN
} from './services/editor-http.service';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule
  ],
  declarations: [
    EditorTimelineComponent,
    SlideListComponent,
    SlideDetailComponent,
    SettingsComponent
  ],
  exports: [EditorTimelineComponent],
  providers: [
    { provide: EDITOR_HTTP_SERVICE_TOKEN, useClass: EditorHttpService }
  ]
})
export class TimelineModule {}
