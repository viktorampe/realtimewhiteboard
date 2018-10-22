import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@campus/ui';
import { HeaderComponent } from './header/header.component';
@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class SharedModule {}
