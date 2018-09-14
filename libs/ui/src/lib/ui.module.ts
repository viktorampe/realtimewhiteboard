import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdaptableListComponent } from './adaptable-list/adaptable-list.component';
import { FileExtensionPresenterComponent } from './file-extension-presenter/file-extension-presenter.component';
import { FormInputComponent } from './form/form-input/form-input.component';
import { FormSelectComponent } from './form/form-select/form-select.component';
import { FormTextareaComponent } from './form/form-textarea/form-textarea.component';
import { InfoPanelEducontentPreviewComponent } from './info-panel/educontent-preview/educontent-preview.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { InfoPanelStatusComponent } from './info-panel/status/status.component';
import { InputLabelComponent } from './input-label/input-label.component';
import { LabelAndIconButtonComponent } from './label-and-icon-button/label-and-icon-button.component';
import { PeriodLabelComponent } from './period-label/period-label.component';
import { PersonBadgeComponent } from './person-badge/person-badge.component';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    LabelAndIconButtonComponent,
    InfoPanelEducontentPreviewComponent,
    InputLabelComponent,
    AdaptableListComponent,
    InfoPanelComponent,
    PeriodLabelComponent,
    InfoPanelStatusComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    FileExtensionPresenterComponent,
    PersonBadgeComponent
  ],
  exports: [
    InfoPanelComponent,
    LabelAndIconButtonComponent,
    AdaptableListComponent,
    InputLabelComponent,
    PeriodLabelComponent
  ]
})
export class UiModule { }
