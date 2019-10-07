import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditorTimelineComponent } from './components/editor-timeline/editor-timeline.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SlideDetailComponent } from './components/slide-detail/slide-detail.component';
import { SlideListComponent } from './components/slide-list/slide-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  declarations: [
    EditorTimelineComponent,
    SlideListComponent,
    SlideDetailComponent,
    SettingsComponent
  ],
  exports: [EditorTimelineComponent]
})
export class TimelineModule {}
