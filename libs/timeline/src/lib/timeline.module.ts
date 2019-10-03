import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './components/editor/editor.component';
import { SlideListComponent } from './components/slide-list/slide-list.component';
import { SlideDetailComponent } from './components/slide-detail/slide-detail.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  imports: [CommonModule],
  declarations: [EditorComponent, SlideListComponent, SlideDetailComponent, SettingsComponent],
  exports: [EditorComponent, SlideListComponent, SlideDetailComponent, SettingsComponent]
})
export class TimelineModule {}
