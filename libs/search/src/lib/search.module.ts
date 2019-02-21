import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule, MatSelectModule } from '@angular/material';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';

@NgModule({
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule, MatBadgeModule],
  declarations: [SelectFilterComponent],
  exports: [SelectFilterComponent]
})
export class SearchModule {}
