import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { SearchTermComponent } from './components/search-term/search-term.component';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule
  ],
  declarations: [SelectFilterComponent, SearchTermComponent],
  exports: [SelectFilterComponent, SearchTermComponent]
})
export class SearchModule {}
