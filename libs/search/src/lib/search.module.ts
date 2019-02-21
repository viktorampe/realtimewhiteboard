import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material';
import { UiModule } from '@campus/ui';
import {
  ResultListDirective,
  ResultsListComponent
} from './components/results-list/results-list.component';

@NgModule({
  imports: [CommonModule, UiModule, MatTooltipModule],
  declarations: [ResultsListComponent, ResultListDirective],
  exports: [ResultsListComponent]
})
export class SearchModule {}
