import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewComponent } from './list-view/list-view.component';
@NgModule({
  imports: [CommonModule],
  declarations: [ListViewComponent],
  exports: [ListViewComponent]
})
export class UiModule {}
