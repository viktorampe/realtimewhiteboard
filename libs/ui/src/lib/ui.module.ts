import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent, SidebarComponent } from './shell/shell.component';
@NgModule({
  imports: [CommonModule],
  declarations: [ShellComponent, SidebarComponent],
  exports: [ShellComponent]
})
export class UiModule {}
