import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@campus/ui';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';
@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [InfoPanelComponent],
  exports: [InfoPanelComponent]
})
export class PagesSharedModule {}
