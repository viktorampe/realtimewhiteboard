import { LayoutModule } from '@angular/cdk/layout';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSidenavModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { AppBarComponent } from './app-bar/app-bar.component';
import { FileExtensionComponent } from './file-extension/file-extension.component';
import { FilterTextInputComponent } from './filter/input/filter-text-input/filter-text-input.component';
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
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutModule,
    MatIconModule,
    RouterModule,
    CdkTreeModule
  ],
  declarations: [
    FilterTextInputComponent,
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
    FilterTextInputComponent,
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
