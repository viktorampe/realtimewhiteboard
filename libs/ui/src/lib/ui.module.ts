import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from './shell/shell.component';
import { ShellLogoDirective } from './shell/directives/shell-logo.directive';
import { ShellTopContainerDirective } from './shell/directives/shell-top-container.directive';
import { ShellLeftContainerDirective } from './shell/directives/shell-left-container.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ShellComponent,
    ShellLogoDirective,
    ShellTopContainerDirective,
    ShellLeftContainerDirective
  ],
  exports: [
    ShellComponent,
    ShellLogoDirective,
    ShellTopContainerDirective,
    ShellLeftContainerDirective
  ]
})
export class UiModule {}
