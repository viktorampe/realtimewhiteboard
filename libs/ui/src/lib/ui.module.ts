import { NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header/page-header.component';
@NgModule({
  imports: [CommonModule],
  declarations: [PageHeaderComponent],
  exports: [PageHeaderComponent]
})
export class UiModule {}
