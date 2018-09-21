import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentThumbnailComponent } from './content-thumbnail/content-thumbnail.component';
import { ContentActionButtonComponent } from './content-action-button/content-action-button.component';
@NgModule({
  imports: [CommonModule],
  declarations: [ContentThumbnailComponent, ContentActionButtonComponent],
  exports: [ContentThumbnailComponent, ContentActionButtonComponent]
})
export class UiModule {}
