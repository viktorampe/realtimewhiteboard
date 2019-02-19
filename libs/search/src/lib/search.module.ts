import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';
import { SearchTermComponent } from './components/search-term/search-term.component';

@NgModule({
  imports: [CommonModule, MatInputModule, MatAutocompleteModule, FormsModule],
  declarations: [SearchTermComponent],
  exports: [SearchTermComponent]
})
export class SearchModule {}
