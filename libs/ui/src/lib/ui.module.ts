import { NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultilineTitleIconComponent } from './multiline-title-icon/multiline-title-icon.component';
@NgModule({
  imports: [CommonModule],
  declarations: [MultilineTitleIconComponent],
  exports: [MultilineTitleIconComponent]
})
export class UiModule {}
