import { ScrollingModule } from '@angular/cdk/scrolling';
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
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import { UiModule } from '@campus/ui';
import { BreadcrumbFilterComponent } from './components/breadcrumb-filter/breadcrumb-filter.component';
import { CheckboxLineFilterComponent } from './components/checkbox-line-filter/checkbox-line-filter-component';
import { CheckboxFilterComponent } from './components/checkbox-list-filter/checkbox-filter/checkbox-filter.component';
import { CheckboxListFilterComponent } from './components/checkbox-list-filter/checkbox-list-filter.component';
import { ColumnFilterComponent } from './components/column-filter/column-filter.component';
import {
  ResultListDirective,
  ResultsListComponent
} from './components/results-list/results-list.component';
import { SearchTermComponent } from './components/search-term/search-term.component';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    UiModule,
    MatTooltipModule,
    ScrollingModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatBadgeModule,
    MatInputModule,
    MatListModule,
    MatAutocompleteModule
  ],
  declarations: [
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    ResultsListComponent,
    ResultListDirective,
    CheckboxLineFilterComponent,
    CheckboxListFilterComponent,
    CheckboxFilterComponent,
    ColumnFilterComponent
  ],
  exports: [
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    ResultsListComponent,
    CheckboxLineFilterComponent,
    CheckboxListFilterComponent,
    CheckboxFilterComponent,
    ColumnFilterComponent
  ]
})
export class SearchModule {}
