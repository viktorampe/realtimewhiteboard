import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ResultListDirective,
  ResultsListComponentComponent
} from './components/results-list-component/results-list-component.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ResultsListComponentComponent, ResultListDirective],
  exports: [ResultsListComponentComponent]
})
export class SearchModule {}
