import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideSheetComponent } from './side-sheet/side-sheet.component';
@NgModule({
  imports: [CommonModule],
  declarations: [SideSheetComponent],
  exports: [SideSheetComponent]
})
export class UiModule {}
