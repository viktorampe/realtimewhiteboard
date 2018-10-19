import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { AppBarComponent } from './app-bar/app-bar.component';
import { ButtonComponent } from './button/button.component';
import { BorderDirective } from './button/directives/button-border.directive';
import { CircleDirective } from './button/directives/button-circle.directive';
import { DangerDirective } from './button/directives/button-danger.directive';
import { DisabledDirective } from './button/directives/button-disabled.directive';
import { RoundedCornersDirective } from './button/directives/button-rounded-corners.directive';
import { WarningDirective } from './button/directives/button-warning.directive';
import { ConfirmableSelectComponent } from './confirmable-select/confirmable-select.component';
import { ContentPreviewComponent } from './content-preview/content-preview.component';
import { ContentThumbnailComponent } from './content-thumbnail/content-thumbnail.component';
import { EditableInlineTagListComponent } from './editable-inline-tag-list/editable-inline-tag-list.component';
import { FileExtensionComponent } from './file-extension/file-extension.component';
import { FilterTextInputComponent } from './filter-text-input/filter-text-input.component';
import { FolderDetailsDirective } from './folder/directives/folder-details.directive';
import { FolderComponent } from './folder/folder.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { ListViewItemDirective } from './list-view/directives/list-view-item.directive';
import { ListViewComponent } from './list-view/list-view.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PersonBadgeComponent } from './person-badge/person-badge.component';
import { PersonInitialsPipe } from './person-badge/pipes/person-initials.pipe';
import { ShellBodyDirective } from './shell/directives/shell-body.directive';
import { ShellLeftDirective } from './shell/directives/shell-left.directive';
import { ShellLogoDirective } from './shell/directives/shell-logo.directive';
import { ShellTopDirective } from './shell/directives/shell-top.directive';
import { ShellComponent } from './shell/shell.component';
import { SideSheetBodyDirective } from './side-sheet/directives/side-sheet-body.directive';
import { SideSheetHeaderDirective } from './side-sheet/directives/side-sheet-header.directive';
import { SideSheetPageDirective } from './side-sheet/directives/side-sheet-page.directive';
import { SideSheetComponent } from './side-sheet/side-sheet.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { TreeNavComponent } from './tree-nav/tree-nav.component';
import { AdjustColorBrightnessPipe } from './utils/pipes/adjust-color-brightness.pipe';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

@NgModule({
  imports: [
    OverlayModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutModule,
    MatIconModule,
    RouterModule,
    CdkTreeModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule
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
    TreeNavComponent,
    InfoPanelComponent,
    PersonBadgeComponent,
    PersonInitialsPipe,
    ContentPreviewComponent,
    ConfirmableSelectComponent,
    EditableInlineTagListComponent,
    FileExtensionComponent,
    TreeNavComponent,
    ContentThumbnailComponent,
    ButtonComponent,
    ListViewComponent,
    ListViewItemDirective,
    TreeNavComponent,
    PersonBadgeComponent,
    PersonInitialsPipe,
    FolderDetailsDirective,
    FolderComponent,
    AdjustColorBrightnessPipe,
    CircleDirective,
    RoundedCornersDirective,
    BorderDirective,
    DangerDirective,
    WarningDirective,
    DisabledDirective,
    TreeNavComponent,
    ToolBarComponent,
    BreadcrumbsComponent
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
    TreeNavComponent,
    InfoPanelComponent,
    PersonBadgeComponent,
    ContentPreviewComponent,
    ConfirmableSelectComponent,
    EditableInlineTagListComponent,
    FileExtensionComponent,
    TreeNavComponent,
    ContentThumbnailComponent,
    ButtonComponent,
    ListViewComponent,
    ListViewItemDirective,
    TreeNavComponent,
    PersonBadgeComponent,
    FolderDetailsDirective,
    FolderComponent,
    AdjustColorBrightnessPipe,
    CircleDirective,
    RoundedCornersDirective,
    BorderDirective,
    DangerDirective,
    WarningDirective,
    DisabledDirective,
    TreeNavComponent,
    ToolBarComponent,
    BreadcrumbsComponent
  ]
})
export class UiModule {}
