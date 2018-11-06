import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@campus/ui';
import { ScormResultsService } from './scorm/scorm-results.service';
@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [],
  exports: [ScormResultsService]
})
export class PagesSharedModule {}
