import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';

@NgModule({
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule],
  declarations: [SelectFilterComponent],
  exports: [SelectFilterComponent]
})
export class SearchModule {}
