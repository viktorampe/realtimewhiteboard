import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EditorTimelineComponent } from './components/editor-timeline/editor-timeline.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SlideDetailComponent } from './components/slide-detail/slide-detail.component';
import { SlideListComponent } from './components/slide-list/slide-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    EditorTimelineComponent,
    SlideListComponent,
    SlideDetailComponent,
    SettingsComponent
  ],
  exports: [EditorTimelineComponent]
})
export class TimelineModule {}
