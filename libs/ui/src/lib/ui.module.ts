import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { CdkTreeModule } from '@angular/cdk/tree';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MatIconModule, MatSidenavModule } from '@angular/material';
import { AppBarComponent } from './app-bar/app-bar.component';
import { FileExtensionComponent } from './file-extension/file-extension.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { ShellBodyDirective } from './shell/directives/shell-body.directive';
import { ShellLeftDirective } from './shell/directives/shell-left.directive';
import { ShellLogoDirective } from './shell/directives/shell-logo.directive';
import { ShellTopDirective } from './shell/directives/shell-top.directive';
import { ShellComponent } from './shell/shell.component';
import { SideSheetBodyDirective } from './side-sheet/directives/side-sheet-body.directive';
import { SideSheetHeaderDirective } from './side-sheet/directives/side-sheet-header.directive';
import { SideSheetPageDirective } from './side-sheet/directives/side-sheet-page.directive';
import { SideSheetComponent } from './side-sheet/side-sheet.component';
import { TreeNavComponent } from './tree-nav/tree-nav.component';

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    LayoutModule,
    MatIconModule,
    RouterModule,
    CdkTreeModule
  ],
  declarations: [
    SideSheetComponent,
    SideSheetHeaderDirective,
    SideSheetBodyDirective,
    SideSheetPageDirective,
    ShellComponent,
    ShellLogoDirective,
    ShellTopDirective,
    ShellLeftDirective,
    ShellBodyDirective,
    AppBarComponent,
    PageHeaderComponent,
    FileExtensionComponent,
    TreeNavComponent
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
    ShellBodyDirective,
    AppBarComponent,
    PageHeaderComponent,
    FileExtensionComponent,
    TreeNavComponent
  ]
})
export class UiModule {}
