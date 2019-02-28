import { ScrollingModule } from '@angular/cdk/scrolling';
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
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import { UiModule } from '@campus/ui';
import { BreadcrumbFilterComponent } from './components/breadcrumb-filter/breadcrumb-filter.component';
import { CheckboxLineFilterComponent } from './components/checkbox-line-filter/checkbox-line-filter-component';
import { ColumnFilterComponent } from './components/column-filter/column-filter.component';
import {
  ResultListDirective,
  ResultsListComponent
} from './components/results-list/results-list.component';
import { SearchTermComponent } from './components/search-term/search-term.component';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';
import { SearchComponent } from './components/search/search.component';

@NgModule({
  imports: [
    CommonModule,
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
    MatAutocompleteModule,
    FormsModule
  ],
  declarations: [
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    ResultsListComponent,
    ResultListDirective,
    CheckboxLineFilterComponent,
    ColumnFilterComponent,
    SearchComponent
  ],
  exports: [
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    ResultsListComponent,
    CheckboxLineFilterComponent,
    ColumnFilterComponent,
    SearchComponent
  ]
})
export class SearchModule {}
