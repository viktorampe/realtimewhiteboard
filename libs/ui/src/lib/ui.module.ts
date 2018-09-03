import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InfoPanelActionComponent } from './info-panel/action/action.component';
import { InfoPanelEducontentPreviewComponent } from './info-panel/educontent-preview/educontent-preview.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { InfoPanelInputLabelComponent } from './info-panel/input-label/input-label.component';
import { InfoPanelSelectionListComponent } from './info-panel/selection-list/selection-list.component';
import { InfoPanelUserListComponent } from './info-panel/user-list/user-list.component';
@NgModule({
  imports: [CommonModule],
  declarations: [
    InfoPanelActionComponent,
    InfoPanelEducontentPreviewComponent,
    InfoPanelInputLabelComponent,
    InfoPanelUserListComponent,
    InfoPanelSelectionListComponent,
    InfoPanelComponent
  ],
  exports: [InfoPanelComponent]
})
export class UiModule {}
