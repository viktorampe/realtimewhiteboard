import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from './shell/shell.component';
import { ShellLogoDirective } from './shell/directives/shell-logo.directive';
import { ShellTopDirective } from './shell/directives/shell-top.directive';
import { ShellLeftDirective } from './shell/directives/shell-left.directive';
import { MatSidenavModule, MatIconModule } from '@angular/material';
import { ShellBodyDirective } from './shell/directives/shell-body.directive';

@NgModule({
  imports: [CommonModule, MatSidenavModule, MatIconModule],
  declarations: [
    ShellComponent,
    ShellLogoDirective,
    ShellTopDirective,
    ShellLeftDirective,
    ShellBodyDirective
  ],
  exports: [
    ShellComponent,
    ShellLogoDirective,
    ShellTopDirective,
    ShellLeftDirective,
    ShellBodyDirective
  ]
})
export class UiModule {}
