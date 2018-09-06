import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBarComponent } from './app-bar/app-bar.component';
import { AppBarItemComponent } from './app-bar/app-bar-item/app-bar-item.component';
@NgModule({
  imports: [CommonModule],
  declarations: [AppBarComponent, AppBarItemComponent],
  exports: [AppBarComponent, AppBarItemComponent]
})
export class UiModule {}
