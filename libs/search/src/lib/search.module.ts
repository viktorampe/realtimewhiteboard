import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResultsListComponentComponent } from './components/results-list-component/results-list-component.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ResultsListComponentComponent],
  exports: [ResultsListComponentComponent]
})
export class SearchModule {}
