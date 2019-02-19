import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material';
import { ColumnFilterComponent } from './components/column-filter.component';

@NgModule({
  imports: [CommonModule, MatListModule],
  declarations: [ColumnFilterComponent],
  exports: [ColumnFilterComponent]
})
export class SearchModule {}
