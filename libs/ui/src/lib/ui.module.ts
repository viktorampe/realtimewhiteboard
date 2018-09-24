import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';
import { MatSidenavModule, MatIconModule } from '@angular/material';
import { SideSheetBodyDirective } from './side-sheet/directives/side-sheet-body.directive';
import { SideSheetHeaderDirective } from './side-sheet/directives/side-sheet-header.directive';
import { SideSheetPageDirective } from './side-sheet/directives/side-sheet-page.directive';
import { SideSheetComponent } from './side-sheet/side-sheet.component';
import { ShellComponent } from './shell/shell.component';
import { ShellLogoDirective } from './shell/directives/shell-logo.directive';
import { ShellTopDirective } from './shell/directives/shell-top.directive';
import { ShellLeftDirective } from './shell/directives/shell-left.directive';
import { ShellBodyDirective } from './shell/directives/shell-body.directive';

@NgModule({
  imports: [CommonModule, MatSidenavModule, LayoutModule, MatIconModule],
  declarations: [
    SideSheetComponent,
    SideSheetHeaderDirective,
    SideSheetBodyDirective,
    SideSheetPageDirective,
    ShellComponent,
    ShellLogoDirective,
    ShellTopDirective,
    ShellLeftDirective,
    ShellBodyDirective
  ],
  exports: [
    SideSheetComponent,
    SideSheetHeaderDirective,
    SideSheetBodyDirective,
    SideSheetPageDirective,
    ShellComponent,
    ShellLogoDirective,
    ShellTopDirective,
    ShellLeftDirective,
    ShellBodyDirective
  ]
})
export class UiModule {}
