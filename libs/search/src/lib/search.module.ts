import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { UiModule } from '@campus/ui';
import { BreadcrumbFilterComponent } from './components/breadcrumb-filter/breadcrumb-filter.component';
import { CheckboxLineFilterComponent } from './components/checkbox-line-filter/checkbox-line-filter-component';
import { SearchTermComponent } from './components/search-term/search-term.component';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatIconModule,
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule
  ],
  declarations: [
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    CheckboxLineFilterComponent
  ],
  exports: [
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    CheckboxLineFilterComponent
  ]
})
export class SearchModule {}
