import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmableSelectComponent } from './confirmable-select/confirmable-select.component';
import { ContentPreviewComponent } from './content-preview/content-preview.component';
import { EditableInlineTagListComponent } from './editable-inline-tag-list/editable-inline-tag-list.component';
import { FileExtensionComponent } from './file-extension/file-extension.component';
import { InputLabelComponent } from './input-label/input-label.component';
import { LabelAndIconButtonComponent } from './label-and-icon-button/label-and-icon-button.component';
import { PeriodLabelComponent } from './period-label/period-label.component';
import { PersonBadgeComponent } from './person-badge/person-badge.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  declarations: [
    LabelAndIconButtonComponent,
    ContentPreviewComponent,
    InputLabelComponent,
    EditableInlineTagListComponent,
    PeriodLabelComponent,
    ConfirmableSelectComponent,
    FileExtensionComponent,
    PersonBadgeComponent
  ],
  exports: [
    LabelAndIconButtonComponent,
    ContentPreviewComponent,
    InputLabelComponent,
    EditableInlineTagListComponent,
    PeriodLabelComponent,
    ConfirmableSelectComponent,
    FileExtensionComponent,
    PersonBadgeComponent
  ]
})
export class UiModule { }
