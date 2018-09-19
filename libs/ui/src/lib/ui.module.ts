import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from './shell/shell.component';
import { ShellLogoDirective } from './shell/directives/shell-logo.directive';
import { ShellTopContainerDirective } from './shell/directives/shell-top-container.directive';
import { ShellLeftContainerDirective } from './shell/directives/shell-left-container.directive';
import { MatSidenavModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, MatSidenavModule, MatIconModule],
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
