import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileExtensionPresenterComponent } from './file-extension-presenter/file-extension-presenter.component';
import { FormInputComponent } from './form/form-input/form-input.component';
import { FormSelectComponent } from './form/form-select/form-select.component';
import { FormTextareaComponent } from './form/form-textarea/form-textarea.component';
import { InfoPanelAdaptableListComponent } from './info-panel/adaptable-list/adaptable-list.component';
import { InfoPanelEducontentPreviewComponent } from './info-panel/educontent-preview/educontent-preview.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { InfoPanelInputLabelComponent } from './info-panel/input-label/input-label.component';
import { InfoPanelPeriodLabelComponent } from './info-panel/period-label/period-label.component';
import { InfoPanelStatusComponent } from './info-panel/status/status.component';
import { LabelAndIconButtonComponent } from './label-and-icon-button/label-and-icon-button.component';
import { PersonBadgeComponent } from './person-badge/person-badge.component';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    LabelAndIconButtonComponent,
    InfoPanelEducontentPreviewComponent,
    InfoPanelInputLabelComponent,
    InfoPanelAdaptableListComponent,
    InfoPanelComponent,
    InfoPanelPeriodLabelComponent,
    InfoPanelStatusComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    FileExtensionPresenterComponent,
    PersonBadgeComponent
  ],
  exports: [
    InfoPanelComponent,
    LabelAndIconButtonComponent
  ]
})
export class UiModule { }
