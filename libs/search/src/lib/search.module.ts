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
import { UtilsModule } from '@campus/utils';
import { BreadcrumbFilterComponent } from './components/breadcrumb-filter/breadcrumb-filter.component';
import { CheckboxLineFilterComponent } from './components/checkbox-line-filter/checkbox-line-filter-component';
import { CheckboxFilterComponent } from './components/checkbox-list-filter/checkbox-filter/checkbox-filter.component';
import { CheckboxListFilterComponent } from './components/checkbox-list-filter/checkbox-list-filter.component';
import { ColumnFilterComponent } from './components/column-filter/column-filter.component';
import { ColumnFilterService } from './components/column-filter/column-filter.service';
import { ResultItemBase } from './components/results-list/result.component.base';
import {
  ResultListDirective,
  ResultsListComponent
} from './components/results-list/results-list.component';
import { SearchTermComponent } from './components/search-term/search-term.component';
import { SearchComponent } from './components/search/search.component';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';
import { SearchPortalDirective } from './directives/search-portal.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    UiModule,
    MatTooltipModule,
    ScrollingModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatBadgeModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatAutocompleteModule,
    FormsModule,
    UtilsModule
  ],
  declarations: [
    ResultItemBase,
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    ResultsListComponent,
    ResultListDirective,
    CheckboxLineFilterComponent,
    SearchComponent,
    CheckboxListFilterComponent,
    CheckboxFilterComponent,
    ColumnFilterComponent,
    SearchPortalDirective
  ],
  exports: [
    BreadcrumbFilterComponent,
    SelectFilterComponent,
    SearchTermComponent,
    ResultsListComponent,
    CheckboxLineFilterComponent,
    SearchComponent,
    CheckboxListFilterComponent,
    CheckboxFilterComponent,
    ColumnFilterComponent,
    SearchComponent,
    SearchPortalDirective
  ],
  providers: [ColumnFilterService],
  entryComponents: [
    CheckboxFilterComponent,
    CheckboxLineFilterComponent,
    CheckboxListFilterComponent,
    BreadcrumbFilterComponent,
    ColumnFilterComponent,
    SelectFilterComponent,
    SearchTermComponent
  ]
})
export class SearchModule {}
