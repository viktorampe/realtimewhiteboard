import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentThumbnailComponent } from './content-thumbnail/content-thumbnail.component';
@NgModule({
  imports: [CommonModule],
  declarations: [ContentThumbnailComponent],
  exports: [ContentThumbnailComponent]
})
export class UiModule {}
