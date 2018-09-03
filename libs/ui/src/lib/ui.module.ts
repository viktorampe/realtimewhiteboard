import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionComponent } from './info-panel/action/action.component';
import { EducontentPreviewComponent } from './info-panel/educontent-preview/educontent-preview.component';
import { InputLabelComponent } from './info-panel/input-label/input-label.component';
import { UserListComponent } from './info-panel/user-list/user-list.component';
import { SelectionListComponent } from './info-panel/selection-list/selection-list.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
@NgModule({
  imports: [CommonModule],
  declarations: [ActionComponent, EducontentPreviewComponent, InputLabelComponent, UserListComponent, SelectionListComponent, InfoPanelComponent],
  exports: [InfoPanelComponent]
})
export class UiModule {}
