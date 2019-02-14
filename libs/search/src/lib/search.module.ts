import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatListModule } from '@angular/material';
import { CheckboxListFilterComponent } from './components/checkbox-list-filter/checkbox-list-filter.component';
import { CheckboxSelectionListFilterComponent } from './components/checkbox-selection-list-filter/checkbox-selection-list-filter.component';

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule
  ],
  declarations: [
    CheckboxListFilterComponent,
    CheckboxSelectionListFilterComponent
  ],
  exports: [CheckboxListFilterComponent, CheckboxSelectionListFilterComponent]
})
export class SearchModule {}
