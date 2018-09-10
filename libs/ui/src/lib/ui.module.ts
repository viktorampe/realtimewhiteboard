import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBarComponent } from './app-bar/app-bar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AppBarComponent],
  exports: [AppBarComponent]
})
export class UiModule {}
