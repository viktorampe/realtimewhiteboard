import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ColumnFilterComponent } from './components/column-filter.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ColumnFilterComponent],
  exports: [ColumnFilterComponent]
})
export class SearchModule {}
