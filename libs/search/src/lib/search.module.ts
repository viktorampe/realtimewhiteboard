import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchTermComponent } from './components/search-term/search-term.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SearchTermComponent],
  exports: [SearchTermComponent]
})
export class SearchModule {}
