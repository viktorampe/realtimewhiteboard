import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdaptableListComponent } from './adaptable-list/adaptable-list.component';
import { AdaptableSelectComponent } from './adaptable-select/adaptable-select.component';
import { ContentPreviewComponent } from './content-preview/content-preview.component';
import { FileExtensionComponent } from './file-extension/file-extension.component';
import { InputLabelComponent } from './input-label/input-label.component';
import { LabelAndIconButtonComponent } from './label-and-icon-button/label-and-icon-button.component';
import { PeriodLabelComponent } from './period-label/period-label.component';
import { PersonBadgeComponent } from './person-badge/person-badge.component';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    LabelAndIconButtonComponent,
    ContentPreviewComponent,
    InputLabelComponent,
    AdaptableListComponent,
    PeriodLabelComponent,
    AdaptableSelectComponent,
    FileExtensionComponent,
    PersonBadgeComponent
  ],
  exports: [
    LabelAndIconButtonComponent,
    ContentPreviewComponent,
    InputLabelComponent,
    AdaptableListComponent,
    PeriodLabelComponent,
    AdaptableSelectComponent,
    FileExtensionComponent,
    PersonBadgeComponent
  ]
})
export class UiModule {}
