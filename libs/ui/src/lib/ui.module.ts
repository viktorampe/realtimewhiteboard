import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderComponent } from './folder/folder.component';
@NgModule({
  imports: [CommonModule],
  declarations: [FolderComponent],
  exports: [FolderComponent]
})
export class UiModule {}
