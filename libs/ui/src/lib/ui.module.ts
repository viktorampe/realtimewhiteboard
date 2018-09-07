import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoPanelActionComponent } from './info-panel/action/action.component';
import { InfoPanelAdaptableListComponent } from './info-panel/adaptable-list/adaptable-list.component';
import { InfoPanelEducontentPreviewComponent } from './info-panel/educontent-preview/educontent-preview.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { InfoPanelInputLabelComponent } from './info-panel/input-label/input-label.component';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    InfoPanelActionComponent,
    InfoPanelEducontentPreviewComponent,
    InfoPanelInputLabelComponent,
    InfoPanelAdaptableListComponent,
    InfoPanelComponent
  ],
  exports: [InfoPanelComponent]
})
export class UiModule { }
