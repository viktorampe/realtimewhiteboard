import { LayoutModule } from '@angular/cdk/layout';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatSidenavModule,
  MatTooltipModule
} from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { AppBarComponent } from './app-bar/app-bar.component';
import { ConfirmableSelectComponent } from './confirmable-select/confirmable-select.component';
import { ContentActionButtonComponent } from './content-action-button/content-action-button.component';
import { ContentPreviewComponent } from './content-preview/content-preview.component';
import { ContentThumbnailComponent } from './content-thumbnail/content-thumbnail.component';
import { EditableInlineTagListComponent } from './editable-inline-tag-list/editable-inline-tag-list.component';
import { FileExtensionComponent } from './file-extension/file-extension.component';
import { FolderDetailsDirective } from './folder/directives/folder-details.directive';
import { FolderComponent } from './folder/folder.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { InputLabelComponent } from './input-label/input-label.component';
import { LabelAndIconButtonComponent } from './label-and-icon-button/label-and-icon-button.component';
import { ListViewItemDirective } from './list-view/directives/list-view-item.directive';
import { ListViewComponent } from './list-view/list-view.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PeriodLabelComponent } from './period-label/period-label.component';
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
import { TreeNavComponent } from './tree-nav/tree-nav.component';
import { AdjustColorBrightnessPipe } from './utils/pipes/adjust-color-brightness.pipe';

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    LayoutModule,
    MatIconModule,
    RouterModule,
    CdkTreeModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule
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
    TreeNavComponent,
    InfoPanelComponent,
    LabelAndIconButtonComponent,
    ContentPreviewComponent,
    InputLabelComponent,
    EditableInlineTagListComponent,
    PeriodLabelComponent,
    ConfirmableSelectComponent,
    FileExtensionComponent,
    TreeNavComponent,
    ContentThumbnailComponent,
    ContentActionButtonComponent,
    ListViewComponent,
    ListViewItemDirective,
    TreeNavComponent,
    PersonBadgeComponent,
    PersonInitialsPipe,
    FolderDetailsDirective,
    FolderComponent,
    AdjustColorBrightnessPipe
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
    TreeNavComponent,
    InfoPanelComponent,
    LabelAndIconButtonComponent,
    ContentPreviewComponent,
    InputLabelComponent,
    EditableInlineTagListComponent,
    PeriodLabelComponent,
    ConfirmableSelectComponent,
    FileExtensionComponent,
    TreeNavComponent,
    ContentThumbnailComponent,
    ContentActionButtonComponent,
    ListViewComponent,
    ListViewItemDirective,
    TreeNavComponent,
    PersonBadgeComponent,
    FolderDetailsDirective,
    FolderComponent,
    AdjustColorBrightnessPipe
  ]
})
export class UiModule {}
