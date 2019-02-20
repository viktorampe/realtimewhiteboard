import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ResultListDirective,
  ResultsListComponent
} from './components/results-list/results-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ResultsListComponent, ResultListDirective],
  exports: [ResultsListComponent]
})
export class SearchModule {}
