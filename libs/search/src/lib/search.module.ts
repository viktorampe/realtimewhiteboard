import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule
} from '@angular/material';
import { BreadcrumbFilterComponent } from './components/breadcrumb-filter/breadcrumb-filter.component';
import { CheckboxLineFilterComponent } from './components/checkbox-line-filter/checkbox-line-filter-component';
import { ColumnFilterComponent } from './components/column-filter/column-filter.component';
import { SearchTermComponent } from './components/search-term/search-term.component';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';

@NgModule({
  imports: [
    MatCheckboxModule,
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatAutocompleteModule,
    FormsModule
  ],
  declarations: [
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    CheckboxLineFilterComponent,
    ColumnFilterComponent
  ],
  exports: [
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    CheckboxLineFilterComponent,
    ColumnFilterComponent
  ]
})
export class SearchModule {}
