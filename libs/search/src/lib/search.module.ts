import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule
} from '@angular/material';
import { BreadcrumbFilterComponent } from './components/breadcrumb-filter/breadcrumb-filter.component';
import { CheckboxLineFilterComponent } from './components/checkbox-line-filter/checkbox-line-filter-component';
import { CheckboxFilterComponent } from './components/checkbox-list-filter/checkbox-filter/checkbox-filter.component';
import { CheckboxListFilterComponent } from './components/checkbox-list-filter/checkbox-list-filter.component';
import { ColumnFilterComponent } from './components/column-filter/column-filter.component';
import { SearchTermComponent } from './components/search-term/search-term.component';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatBadgeModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatAutocompleteModule
  ],
  declarations: [
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    CheckboxLineFilterComponent,
    CheckboxListFilterComponent,
    CheckboxFilterComponent,
    ColumnFilterComponent
  ],
  exports: [
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    CheckboxLineFilterComponent,
    CheckboxListFilterComponent,
    CheckboxFilterComponent,
    ColumnFilterComponent
  ]
})
export class SearchModule {}
