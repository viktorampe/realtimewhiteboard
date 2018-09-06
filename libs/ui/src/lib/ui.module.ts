import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicAppBarComponent } from './basic-app-bar/basic-app-bar.component';
@NgModule({
  imports: [CommonModule],
  declarations: [BasicAppBarComponent],
  exports: [BasicAppBarComponent]
})
export class UiModule {}
