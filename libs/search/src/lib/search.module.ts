import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatFormFieldModule,
  MatListModule
} from '@angular/material';
import { CheckboxFilterComponent } from './components/checkbox-list-filter/checkbox-filter/checkbox-filter.component';
import { CheckboxListFilterComponent } from './components/checkbox-list-filter/checkbox-list-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatCheckboxModule,
    MatFormFieldModule
  ],
  declarations: [CheckboxListFilterComponent, CheckboxFilterComponent],
  exports: [CheckboxListFilterComponent, CheckboxFilterComponent]
})
export class SearchModule {}
